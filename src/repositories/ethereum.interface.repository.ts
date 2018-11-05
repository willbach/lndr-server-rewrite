const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const fs = require('fs')
const path = require('path')

const serverConfig = require('../services/config.service')
import { bignumToHexString, decomposeSignatureToBytes32 } from '../utils/credit.protocol.util'

import BilateralCreditRecord from '../dto/bilateral-credit-record'
import IssueCreditLog from '../dto/issue-credit-log'

import { stripHexPrefix } from '../utils/buffer.util'

// Const web3 = new Web3(new Web3.providers.HttpProvider(serverConfig.web3Url))
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const rawAbi = fs.readFileSync(path.join(__dirname, '../../data/CreditProtocol.abi.json'), { encoding: 'utf8' })
const cpAbi = JSON.parse(rawAbi)

const ethInterfaceRepo = {
  currentBlockNumber: () => new Promise((resolve, reject) => web3.eth.getBlockNumber((err, data) => {
    err ? reject(err) : resolve(data)
  })) as any,

  currentExecutionNonce: () => new Promise((resolve, reject) => web3.eth.getTransactionCount(serverConfig.default.executionAddress, (err, data) => {
    err ? reject(err) : resolve(data)
  })) as any,

  // eslint-disable-next-line max-statements
  finalizeTransaction: async (record: BilateralCreditRecord) => {
    const { creditRecord, creditorSignature, debtorSignature } = record
    const { creditor, debtor, amount, memo, ucac } = creditRecord

    const execNonce = await new Promise((resolve, reject) => web3.eth.getTransactionCount(`0x${serverConfig.default.executionAddress}`, (err, data) => {
      err ? reject(err) : resolve(data)
    }))
    const privateKeyBuffer = Buffer.from(serverConfig.default.executionPrivateKey.slice(2), 'hex')

    const CreditProtocolContract = web3.eth.contract(cpAbi)
    const contractInstance:any = await new Promise((resolve, reject) => {
      CreditProtocolContract.at(serverConfig.default.creditProtocolAddress, (err, data) => {
        err ? reject(err) : resolve(data)
      })
    })

    const bytes32Memo = web3.fromAscii(memo)
    const cSig = decomposeSignatureToBytes32(creditorSignature)
    const dSig = decomposeSignatureToBytes32(debtorSignature)

    const callData = contractInstance.issueCredit.getData(`0x${ucac}`, `0x${creditor}`, `0x${debtor}`, bignumToHexString(amount), [cSig.r, cSig.s, cSig.v], [dSig.r, dSig.s, dSig.v], bytes32Memo)

    // Console.error(creditorSignature, '\n', debtorSignature)
    // Console.error('SIGNATURES MATCH:', creditor === signatureToAddress(creditRecord.hash, creditorSignature), debtor === signatureToAddress(creditRecord.hash, debtorSignature))
    // Console.error(`0x${ucac}`, `0x${creditor}`, `0x${debtor}`, bignumToHexString(amount), [cSig.r, cSig.s, cSig.v], [dSig.r, dSig.s, dSig.v], bytes32Memo)
    // Console.error('CALL DATA', callData)
    // Console.error('EXEC NONCE', execNonce)

    const rawTx = {
      chainId: 1,
      data: callData,
      from: `0x${serverConfig.default.executionAddress}`,
      gasLimit: serverConfig.default.maxGas,
      gasPrice: serverConfig.default.gasPrice,
      nonce: execNonce,
      to: serverConfig.default.creditProtocolAddress,
      value: '0x00'
    }

    const tx = new Tx(rawTx)
    tx.sign(privateKeyBuffer)
    const serializedTx = tx.serialize()

    // Const nonceResult = await new Promise((resolve, reject) => {
    //     ContractInstance.getNonce(`0x${creditor}`, `0x${debtor}`, (err, data) => {
    //         If(err) reject(err)
    //         Else resolve(data)
    //     })
    // })

    return new Promise((resolve, reject) => {
      web3.eth.sendRawTransaction(`0x${serializedTx.toString('hex')}`, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  },

  handleLog: (log) => {
    console.error('This was only used on the CLI ', log)
  },

  lndrLogs: () => {
    const issueCreditSubscription = web3.eth.subscribe('logs', {
      address: serverConfig.default.creditProtocolAddress,
      fromBlock: serverConfig.default.scanStartBlock,
      topics: [serverConfig.default.issueCreditEvent]
    })

    issueCreditSubscription.on('data', (log) => {
      if (log.topics.length >= 3) {
        const [ucac, creditor, debtor] = log.topics,
          logStart = 122

        const dataString = log.data.slice(logStart)

        const amount = parseInt(dataString.slice(0, 2), 16)
        const nonce = parseInt(dataString.slice(2, 4), 16)
        const memo = Buffer.from(dataString.slice(4), 'hex').toString('utf8')

        const creditLog = new IssueCreditLog({
          amount,
          creditor: creditor.slice(2),
          debtor: debtor.slice(2),
          memo,
          nonce,
          ucac: ucac.slice(2)
        })

        ethInterfaceRepo.handleLog(creditLog)
      }
    })

    const issueCreditErrorSubscription = web3.eth.subscribe('logs', {
      address: '0x60ef3386514cc5a63a0be3beb3e447f614b09c68697f392e9a5b907f5dbd48b9',
      fromBlock: serverConfig.default.scanStartBlock,
      topics: [serverConfig.default.issueCreditEvent]
    })
    issueCreditErrorSubscription.on('data', console.error)
  },

  // eslint-disable-next-line max-statements, complexity, max-params
  verifySettlementPayment: async (txHash: string, creditor: string, debtor: string, amount: number, settlementCurrency: string) => {
    const tx = await new Promise((resolve, reject) => web3.eth.getTransaction(`0x${txHash}`, (err, data) => {
      err ? reject(err) : resolve(data)
    })) as any

    if (!tx || !tx.value) {
      throw new Error(`transaction not found, tx_hash: ${txHash}`)
    }

    const creditorMatch = creditor === stripHexPrefix(tx.from)
    let debtorMatch = false,
      valueMatch = false,
      txValue = 0

    if (settlementCurrency === 'DAI') {
      const txValueIndex = 114,
        debtorStart = 34,
        debtorEnd = 74
      txValue = parseInt(tx.input.slice(txValueIndex), 16)
      debtorMatch = debtor === tx.input.slice(debtorStart, debtorEnd)
      valueMatch = txValue === amount
    } else {
      txValue = tx.value.toNumber()
      debtorMatch = debtor === stripHexPrefix(tx.to)
      valueMatch = amount === txValue
    }

    if (!creditorMatch) {
      throw new Error(`Bad from match, hash: ${txHash} tx value: ${txValue} settlement value: ${amount}`)
    } else if (!debtorMatch) {
      throw new Error(`Bad to match, hash: ${txHash} tx value: ${txValue} settlement value: ${amount}`)
    } else if (!valueMatch) {
      throw new Error(`Bad value match, hash: ${txHash} tx value: ${txValue} settlement value: ${amount}`)
    }

    return true
  }
}

export default ethInterfaceRepo
