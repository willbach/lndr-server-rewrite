const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const fs = require('fs')
const path = require('path')

import db from '../db'
const serverConfig = require('../services/config.service')
import BilateralCreditRecord from '../dto/bilateral-credit-record'
import { decomposeSignatureToBytes } from '../utils/credit.protocol.util'
import IssueCreditLog from '../dto/issue-credit-log';

const web3 = new Web3(new Web3.providers.HttpProvider(serverConfig.web3Url))
const rawAbi = fs.readFileSync(path.join(__dirname, '../../data/CreditProtocol.abi.json'), {encoding: 'utf8'})
const cpAbi = JSON.parse(rawAbi)

const ethInterfaceRepo = {
    finalizeTransaction: (record: BilateralCreditRecord) => {
        const { creditRecord, creditorSignature, debtorSignature } = record
        const { creditor, debtor, amount, memo, ucac, nonce } = creditRecord

        serverConfig.incrementExecutionNonce()

        const execNonce = serverConfig.executionNonce
        const privateKeyBuffer = Buffer.from(serverConfig.executionPrivateKey, 'hex')
        const cpContract = web3.eth.Contract(cpAbi, serverConfig.creditProtocolAddress)
        const bytes32Memo = Buffer.alloc(32, memo, 'utf8')

        const cSigBuffers = decomposeSignatureToBytes(creditorSignature)
        const dSigBuffers = decomposeSignatureToBytes(debtorSignature)

        const callData = cpContract.methods.issueCredit(ucac, creditor, debtor, Math.floor(amount), cSigBuffers, dSigBuffers, bytes32Memo).encodeABI()

        const rawTx = {
            from: serverConfig.executionAddress,
            to: serverConfig.creditProtocolAddress,
            value: 0,
            gas: serverConfig.maxGas,
            chainId: 1, // 1 is the mainnet chainId
            data: callData
        }

        const tx = new Tx(rawTx)
        tx.sign(privateKeyBuffer)

        const serializedTx = tx.serialize()

        return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log)

        //     let execNonce = executionNonce config
        //         callVal = def { callFrom = Just $ executionAddress config
        //                         , callTo = creditProtocolAddress config
        //                         , callGasPrice = Just . Quantity $ gasPrice config
        //                         , callValue = Just . Quantity $ 0
        //                         , callGas = Just . Quantity $ maxGas config
        //                         }
        //         chainId = 1 -- 1 is the mainnet chainId
        //         (sig1r, sig1s, sig1v) = decomposeSig sig1
        //         (sig2r, sig2s, sig2v) = decomposeSig sig2
        //         encodedMemo :: BytesN 32
        //         encodedMemo = BytesN . BA.convert . T.encodeUtf8 $ memo
        //         issueCreditCall = issueCredit callVal
        //                                         ucac
        //                                         creditor debtor (UIntN amount)
        //                                         (sig1r :< sig1s :< sig1v :< NilL)
        //                                         (sig2r :< sig2s :< sig2v :< NilL)
        //                                         encodedMemo

        //     rawTx <- maybe (throwError (err500 {errBody = "Error generating txData."}))
        //                     pure $ createRawTransaction issueCreditCall
        //                                                 execNonce chainId
        //                                                 (executionPrivateKey config)
        //     result <- lndrWeb3 $ Eth.sendRawTransaction rawTx
        //     pure result
    },

    lndrLogs: () => {
        const issueCreditSubscription = web3.eth.subscribe('logs', {
            fromBlock: serverConfig.scanStartBlock,
            address: serverConfig.creditProtocolAddress,
            topics: [serverConfig.issueCreditEvent]
        })

        issueCreditSubscription.on('data', log => {
            if (log.topics.length >= 3) {
                const [ ucac, creditor, debtor ] = log.topics

                const dataString = log.data.slice(122)

                const amount = parseInt(dataString.slice(0,2), 16)
                const nonce = parseInt(dataString.slice(2,4), 16)
                const memo = Buffer.from(dataString.slice(4), 'hex').toString('utf8')

                const creditLog = new IssueCreditLog({
                    ucac: ucac.slice(2),
                    creditor: creditor.slice(2),
                    debtor: debtor.slice(2),
                    amount,
                    nonce,
                    memo
                })

                ethInterfaceRepo.handleLog(creditLog)
            }
        })
    },

    handleLog: (log) => {
        console.log('This was only used on the CLI ', log)
    },

    verifySettlementPayment: async(txHash: string, creditor: string, debtor: string, amount: number) => {
        const tx = await web3.eth.getTransaction(txHash)

        if (!tx || !tx.value) {
            throw new Error('transaction not found, tx_hash: ' + txHash)
        }

        const creditorMatch = creditor === tx.from.slice(2)
        const debtorMatch = debtor === tx.to.slice(2)
        const valueMatch = amount === parseInt(tx.value.slice(2), 16)

        if (!creditorMatch) {
            throw new Error('Bad from match, hash: ' + txHash + ' tx value: ' + String(parseInt(tx.value.slice(2), 16)) + ' settlement value: ' + amount)
        } else if (!debtorMatch) {
            throw new Error('Bad to match, hash: ' + txHash + ' tx value: ' + String(parseInt(tx.value.slice(2), 16)) + ' settlement value: ' + amount)
        } else if (!valueMatch) {
            throw new Error('Bad value match, hash: ' + txHash + ' tx value: ' + String(parseInt(tx.value.slice(2), 16)) + ' settlement value: ' + amount)
        }

        return true
        // -- | Verify that a settlement payment was made using a 'txHash' corresponding to
        // -- an Ethereum transaction on the blockchain and the associated addresses and
        // -- eth settlement amount.
        // verifySettlementPayment :: TransactionHash -> Address -> Address -> Integer -> LndrHandler ()
        // verifySettlementPayment txHash creditorAddr debtorAddr settlementValue = do
        //     transactionM <- lndrWeb3 . Eth.getTransactionByHash $ addHexPrefix txHash
        //     case transactionM of
        //         (Just transaction) ->
        //             let fromMatch = txFrom transaction == creditorAddr
        //                 toMatch = txTo transaction == Just debtorAddr
        //                 transactionValue = hexToInteger $ txValue transaction
        //                 valueMatch = transactionValue == settlementValue
        //             in case (fromMatch, toMatch, valueMatch) of
        //                 (False, _, _)      -> lndrError $ "Bad from match, hash: " ++ T.unpack txHash
        //                 (_, False, _)      -> lndrError $ "Bad to match, hash: " ++ T.unpack txHash
        //                 (_, _, False)      -> lndrError $ "Bad value match, hash: " ++ T.unpack txHash
        //                                                 ++ "tx value: " ++ show transactionValue
        //                                                 ++ ", settlementValue: " ++ show settlementValue
        //                 (True, True, True) -> pure ()
        //         Nothing -> lndrError $ "transaction not found, tx_hash: " ++ T.unpack txHash
    },

    currentBlockNumber: () => {
        return web3.eth.getBlockNumber()
    },

    currentExecutionNonce: () => {
        return web3.eth.getTransactionCount(serverConfig.executionAddress)
    }
}

export default ethInterfaceRepo
