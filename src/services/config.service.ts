import fs from 'fs'

const config = fs.readFileSync('../data/lndr-server.config.json', { encoding: 'utf8' })
const configObj = JSON.parse(config)

import { privateToAddress } from 'utils/credit.protocol.util'

export default {
    lndrUcacAddrs: configObj['lndr-ucacs'],
    bindAddress: configObj['bind-address'],
    bindPort: configObj['bind-port'],
    creditProtocolAddress: configObj['credit-protocol-address'],
    issueCreditEvent: configObj['issue-credit-event'],
    scanStartBlock: configObj['scan-start-block'],
    dbUser: configObj.db.user,
    dbUserPassword: configObj.db['user-password'],
    dbName: configObj.db.name,
    dbHost: configObj.db.host,
    dbPort: configObj.db.port,
    gasPrice: configObj['gas-price'],
    ethereumPrices: {},
    maxGas: configObj['max-gas'],
    latestBlockNumber: 0,
    heartbeatInterval: configObj['heartbeat-interval'],
    awsPhotoBucket: configObj.aws['photo-bucket'],
    awsAccessKeyId: configObj.aws['access-key-id'],
    awsSecretAccessKey: configObj.aws['secret-access-key'],
    notificationsApiUrl: configObj.notifications['api-url'],
    notificationsApiKey: configObj.notifications['api-key'],
    sumsubApiUrl: configObj.sumsub['api-url'],
    sumsubApiKey: configObj.sumsub['api-key'],
    sumsubApiCallbackSecret: configObj.sumsub['api-callback-secret'],
    web3Url: configObj['web3-url'],
    executionPrivateKey: configObj['execution-private-key'],
    executionAddress: privateToAddress(configObj['execution-private-key']),
    executionNonce: 0,
}
