const fs = require('fs')
const path = require('path')

const config = fs.readFileSync(path.join(__dirname, '../../data/lndr-server.config.json'), { encoding: 'utf8' })
const configObj = JSON.parse(config)

import ConfigResponse from '../dto/config-response'
import ethInterfaceRepo from '../repositories/ethereum.interface.repository'
import heartbeatRepo from '../repositories/heartbeat.repository'
import { privateToAddress } from '../utils/credit.protocol.util'
import verifiedRepo from '../repositories/verified.repository'

const blockNumberStart = 40600

const ethereumPrices = {
  aud: '250',
  cad: '200',
  chf: '250',
  cny: '1600',
  dkk: '1500',
  eur: '200',
  gbp: '200',
  hkd: '1600',
  idr: '2800000',
  ils: '800',
  inr: '13500',
  jpy: '20000',
  krw: '200000',
  myr: '800',
  nok: '2000',
  nzd: '250',
  pln: '750',
  rub: '13000',
  sek: '2000',
  sgd: '270',
  thb: '6400',
  try: '800',
  usd: '200',
  vnd: '4500000'
}

export class ServerConfig {
  lndrUcacAddrs: any
  bindAddress: string
  bindPort: number
  creditProtocolAddress: string
  issueCreditEvent: string
  scanStartBlock: number
  dbUser: string
  dbUserPassword: string
  dbName: string
  dbHost: string
  dbPort: number
  gasPrice: number
  ethereumPrices: any
  maxGas: number
  latestBlockNumber: number
  heartbeatInterval: number
  awsPhotoBucket: string
  awsAccessKeyId: string
  awsSecretAccessKey: string
  notificationsApiUrl: string
  notificationsApiKey: string
  sumsubApiUrl: string
  sumsubApiKey: string
  sumsubApiCallbackSecret: string
  web3Url: string
  executionPrivateKey: string
  executionAddress: string
  executionNonce: number

  /* eslint-disable max-statements, prefer-destructuring */
  constructor(data) {
    const ucacs = data['lndr-ucacs']
    this.lndrUcacAddrs = Object.keys(ucacs).reduce((obj, key) => {
      obj[key.toUpperCase()] = ucacs[key]
      return obj
    }, {})
    this.bindAddress = data['bind-address']
    this.bindPort = data['bind-port']
    this.creditProtocolAddress = data['credit-protocol-address']
    this.issueCreditEvent = data['issue-credit-event']
    this.scanStartBlock = data['scan-start-block']
    this.dbUser = data.db.user
    this.dbUserPassword = data.db['user-password']
    this.dbName = data.db.name
    this.dbHost = data.db.host
    this.dbPort = data.db.port
    this.gasPrice = data['gas-price']
    this.ethereumPrices = ethereumPrices
    this.maxGas = data['max-gas']
    this.latestBlockNumber = 0
    this.heartbeatInterval = data['heartbeat-interval']
    this.awsPhotoBucket = data.aws['photo-bucket']
    this.awsAccessKeyId = data.aws['access-key-id']
    this.awsSecretAccessKey = data.aws['secret-access-key']
    this.notificationsApiUrl = data.notifications['api-url']
    this.notificationsApiKey = data.notifications['api-key']
    this.sumsubApiUrl = data.sumsub['api-url']
    this.sumsubApiKey = data.sumsub['api-key']
    this.sumsubApiCallbackSecret = data.sumsub['api-callback-secret']
    this.web3Url = data['web3-url']

    this.executionAddress = privateToAddress(data['execution-private-key'])
    this.executionNonce = 0

    if (data['execution-private-key'].slice(0, 2) === '0x') {
      this.executionPrivateKey = data['execution-private-key']
    } else {
      this.executionPrivateKey = `0x${data['execution-private-key']}`
    }
  }
  /* eslint-enable max-statements, prefer-destructuring */

  // eslint-disable-next-line class-methods-use-this
  deleteExpiredSettlements() {
    verifiedRepo.deleteExpiredSettlementsAndAssociatedCredits()
  }

  getConfigResponse() {
    return new ConfigResponse({
      creditProtocolAddress: this.creditProtocolAddress,
      ethereumPrices: this.ethereumPrices,
      gasPrice: this.gasPrice,
      lndrAddresses: this.lndrUcacAddrs,
      weekAgoBlock: this.latestBlockNumber - blockNumberStart
    })
  }

  getUcac(currency: string) {
    return this.lndrUcacAddrs[currency.toUpperCase()]
  }

  heartbeat() {
    setInterval(() => {
      this.updateServerConfig()

      this.deleteExpiredSettlements()

      this.verifySettlementsWithTxHash()

      console.error('heartbeat')
    }, this.heartbeatInterval)
  }

  /* eslint-disable */
  async updateServerConfig() {
    try {
      const prices = await heartbeatRepo.queryEtheruemPrices()
      const { data: { rates } } = prices

      this.ethereumPrices = Object.keys(rates).reduce((obj, key) => {
        obj[key.toLowerCase()] = rates[key]
        return obj
      }, {})
    } catch (err) {
      console.error('Error getting Ethereum prices:', err)
    }

    try {
      const currentGasPrice = await heartbeatRepo.querySafelow()
      this.gasPrice = currentGasPrice
    } catch (err) {
      console.error('Error getting gas price:', err)
    }

    try {
      const latestBlockNumber = await ethInterfaceRepo.currentBlockNumber()
      this.latestBlockNumber = latestBlockNumber
    } catch (err) {
      console.error('Error getting latest blocknumber:', err)
    }
  }

  async verifyRecords(credits: any /* [BilateralCreditRecord]*/) {
    const firstRecord = credits[0]

    if (!firstRecord || !firstRecord.txHash) {
      throw new Error('Bilateral Settlement Record does not have txHash.')
    }

    const firstCreditor = firstRecord.creditRecord.creditor
    const firstDebtor = firstRecord.creditRecord.debtor

    const creditRecords = credits.map((credit) => credit.creditRecord)

    let creditorAmount = 0
    let debtorAmount = 0

    creditRecords.forEach((record) => {
      if (record.creditor === firstCreditor && record.settlementAmount) {
        creditorAmount += record.settlementAmount
      } else if (record.debtor === firstCreditor && record.settlementAmount) {
        debtorAmount += record.settlementAmount
      }
    })

    const settlementCreditor = creditorAmount > debtorAmount ? firstCreditor : firstDebtor
    const settlementDebtor = creditorAmount > debtorAmount ? firstDebtor : firstCreditor

    await ethInterfaceRepo.verifySettlementPayment(firstRecord.txHash, settlementCreditor, settlementDebtor, Math.abs(creditorAmount - debtorAmount), firstRecord.creditRecord.settlementCurrency)

    await Promise.all(creditRecords.map((record) => verifiedRepo.verifyCreditByHash(record.hash)))

    const results: any = []

    let index = 0
    while (credits.length > 0) {
      const record = credits.shift()
      await ethInterfaceRepo.finalizeTransaction(record)
        .then((hash) => results.push(hash))
        .catch((err) => {
          console.error('[POST] /multi_settlement', err)
        })
      index += 1
    }

    console.error('SETTLEMENTS WEB3: ', results)
  }
  /* eslint-enable */

  async verifySettlementsWithTxHash() {
    try {
      const txHashes = await verifiedRepo.txHashesToVerify()
      const creditsToVerify = await Promise.all(txHashes.map((hash) => verifiedRepo.lookupCreditsByTxHash(hash)))
      await Promise.all(creditsToVerify.map((creditList) => this.verifyRecords(creditList)))
    } catch (err) {
      console.error('Error confirming settlements: ', err)
    }
  }
}

const serverConfig = new ServerConfig(configObj)

serverConfig.heartbeat()

export default serverConfig
