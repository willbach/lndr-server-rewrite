const fs = require('fs')
const path = require('path')

const config = fs.readFileSync(path.join(__dirname, '../../data/lndr-server.config.json'), { encoding: 'utf8' })
const configObj = JSON.parse(config)

import { privateToAddress } from '../utils/credit.protocol.util'
import ConfigResponse from '../dto/config-response'
import BilateralCreditRecord from '../dto/bilateral-credit-record'
import heartbeatRepo from '../repositories/heartbeat.repository'
import ethInterfaceRepo from '../repositories/ethereum.interface.repository'
import verifiedRepo from '../repositories/verified.repository'

const ethereumPrices = {
    AUD: '250',
    CAD: '200',
    CNY: '1600',
    CHF: '250',
    DKK: '1500',
    EUR: '200',
    GBP: '200',
    HKD: '1600',
    IDR: '2800000',
    ILS: '800',
    INR: '13500',
    JPY: '20000',
    KRW: '200000',
    MYR: '800',
    NOK: '2000',
    NZD: '250',
    PLN: '750',
    RUB: '13000',
    SEK: '2000',
    SGD: '270',
    THB: '6400',
    TRY: '800',
    USD: '200',
    VND: '4500000',
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

        if (data['execution-private-key'].slice(0,2) === '0x') {
            this.executionPrivateKey = data['execution-private-key']
        } else {
            this.executionPrivateKey = '0x' + data['execution-private-key'] 
        }
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

    heartbeat() {
        setInterval(() => {
            //     -- update server config
            //     liftIO $ updateServerConfig configTVar
            this.updateServerConfig()
            //     -- scan settlements table for any settlement eligible for deletion
            //     deleteExpiredSettlements
            this.deleteExpiredSettlements()
            //     -- try to verify all settlements whose tx_hash column is populated
            //     verifySettlementsWithTxHash
            this.verifySettlementsWithTxHash()
            //     -- log hearbeat statistics
            //     liftIO $ pushLogStrLn loggerSet . toLogStr $ ("heartbeat" :: Text)
            console.log('heartbeat')
            //     -- sleep for time specified in config (default 3000ms)
            //     config <- liftIO $ readTVarIO configTVar
            //     liftIO $ threadDelay (heartbeatInterval config * 10 ^ 6)
        }, this.heartbeatInterval)
    }

    async updateServerConfig() {
        try {
            const prices = await heartbeatRepo.queryEtheruemPrices()
            this.ethereumPrices = prices.data.rates
        } catch(e) {
            console.log('Error getting Ethereum prices:', e)
        }

        try {
            const currentGasPrice = await heartbeatRepo.querySafelow()
            this.gasPrice = currentGasPrice
        } catch(e) {
            console.log('Error getting gas price:', e)
        }

        try {
            const latestBlockNumber = await ethInterfaceRepo.currentBlockNumber()
            this.latestBlockNumber = latestBlockNumber
        } catch(e) {
            console.log('Error getting latest blocknumber:', e)
        }
    }

    deleteExpiredSettlements() {
        verifiedRepo.deleteExpiredSettlementsAndAssociatedCredits()
    }

    async verifySettlementsWithTxHash() {
        try {
            const txHashes = await verifiedRepo.txHashesToVerify()
            const creditsToVerify = await Promise.all(txHashes.map(hash => verifiedRepo.lookupCreditsByTxHash(hash)))
            await Promise.all(creditsToVerify.map(creditList => this.verifyRecords(creditList)))
        } catch(e) {
            console.log('Error confirming settlements: ', e)
        }
        // verifySettlementsWithTxHash :: LndrHandler ()
        // verifySettlementsWithTxHash = do
        //     (ServerState pool configTVar _) <- ask
        //     config <- liftIO $ readTVarIO configTVar
        //     txHashes <- liftIO $ withResource pool Db.txHashesToVerify
        //     creditsToVerify <- mapM (liftIO . withResource pool . Db.lookupCreditsByTxHash) txHashes
        //     mapM_ verifyRecords creditsToVerify
    }

    async verifyRecords(credits: any /*[BilateralCreditRecord]*/) {
        const firstRecord = credits[0]

        if (!firstRecord || !firstRecord.txHash) {
            throw new Error('Bilateral Settlement Record does not have txHash.')
        }

        const firstCreditor = firstRecord.creditRecord.creditor
        const firstDebtor = firstRecord.creditRecord.debtor

        const creditRecords = credits.map(credit => credit.creditRecord)
        
        let creditorAmount = 0
        let debtorAmount = 0

        creditRecords.forEach(record => {
            if (record.creditor === firstCreditor && record.settlementAmount) {
                creditorAmount += record.settlementAmount
            } else if (record.debtor === firstDebtor && record.settlementAmount) {
                debtorAmount += record.settlementAmount
            }
        })

        const settlementCreditor = creditorAmount > debtorAmount ? firstCreditor : firstDebtor
        const settlementDebtor = creditorAmount > debtorAmount ? firstDebtor : firstCreditor

        await ethInterfaceRepo.verifySettlementPayment(firstRecord.txHash, settlementCreditor, settlementDebtor, Math.abs(creditorAmount - debtorAmount), firstRecord.creditRecord.settlementCurrency)

        await Promise.all(creditRecords.map(record => verifiedRepo.verifyCreditByHash(record.hash)))

        const results = await Promise.all(credits.map(record => ethInterfaceRepo.finalizeTransaction(record)))

        console.log('SETTLEMENTS WEB3: ', results)



        // verifyRecords :: [BilateralCreditRecord] -> LndrHandler ()
        // verifyRecords records = do
        //     (ServerState pool configTVar loggerSet) <- ask
            
        //     let firstRecord = head records
            
        //     initialTxHash <- maybe (throwError (err500 {errBody = "Bilateral Settlement Record does not have txHash."})) 
        //                      pure . txHash $ head records
        //     -- this should only take the creditor, debtor, credit hash, and settlement amount
        //     let firstCreditor = creditor $ creditRecord $ firstRecord
        //         firstDebtor = debtor $ creditRecord $ firstRecord
        //         deriveSettlementAmount = fromMaybe 0 . settlementAmount . creditRecord
        //         isFirstCreditor = (== firstCreditor) . creditor . creditRecord
        //         creditorAmount = sum . fmap deriveSettlementAmount $ filter isFirstCreditor $ records
        //         debtorAmount = sum . fmap deriveSettlementAmount $ filter (not . isFirstCreditor) $ records
        //         settlementCreditor = if creditorAmount > debtorAmount then firstCreditor else firstDebtor
        //         settlementDebtor = if creditorAmount > debtorAmount then firstDebtor else firstCreditor
            
        //     verifySettlementPayment initialTxHash settlementCreditor settlementDebtor (abs $ creditorAmount - debtorAmount)
        //     mapM_ (liftIO . withResource pool . Db.verifyCreditByHash . hash . creditRecord) records
        //     web3Result <- mapM (finalizeTransaction configTVar) records
        //                 -- `catchError` (pure . T.pack . show)
        //     liftIO $ pushLogStrLn loggerSet . toLogStr . ("WEB3: " ++) . show $ web3Result
    }
}

const serverConfig = new ServerConfig(configObj)

serverConfig.heartbeat()

export default serverConfig
