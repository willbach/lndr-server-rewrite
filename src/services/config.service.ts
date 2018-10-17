const fs = require('fs')
const path = require('path')

const config = fs.readFileSync(path.join(__dirname, '../../data/lndr-server.config.json'), { encoding: 'utf8' })
const configObj = JSON.parse(config)

import { privateToAddress } from '../utils/credit.protocol.util'
import ConfigResponse from '../dto/config-response'

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
    gasPrice: string
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

    constructor(data) {
        this.lndrUcacAddrs = data['lndr-ucacs']
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
        this.ethereumPrices = {}
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
        this.executionPrivateKey = data['execution-private-key']
        this.executionAddress = privateToAddress(data['execution-private-key'])
        this.executionNonce = 0
    }

    getUcac(currency: string) {
        return this.lndrUcacAddrs[currency.toLowerCase()]
    }

    getConfigResponse() {
        return new ConfigResponse({
            lndrAddresses: this.lndrUcacAddrs,
            creditProtocolAddress: this.creditProtocolAddress,
            gasPrice: this.gasPrice,
            ethereumPrices: this.ethereumPrices,
            weekAgoBlock: this.latestBlockNumber - 40600
        })
    }

    incrementExecutionNonce() {
        this.executionNonce = this.executionNonce + 1
    }
}

const serverConfig = new ServerConfig(configObj)

export default serverConfig
