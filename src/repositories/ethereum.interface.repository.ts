const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const fs = require('fs')
const path = require('path')
const ethUtil = require('ethereumjs-util')

import db from '../db'
const serverConfig = require('../services/config.service')
import BilateralCreditRecord from '../dto/bilateral-credit-record'
import { decomposeSignatureToBytes } from '../utils/credit.protocol.util'
import IssueCreditLog from '../dto/issue-credit-log'
import { hexToBuffer } from '../utils/buffer.util'
import { Server } from 'https'

// const web3 = new Web3(new Web3.providers.HttpProvider(serverConfig.web3Url))
const web3  = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
const rawAbi = fs.readFileSync(path.join(__dirname, '../../data/CreditProtocol.abi.json'), {encoding: 'utf8'})
const cpAbi = JSON.parse(rawAbi)

const ethInterfaceRepo = {
    finalizeTransaction: async(record: BilateralCreditRecord) => {
        const { creditRecord, creditorSignature, debtorSignature } = record
        const { creditor, debtor, amount, memo, ucac, hash } = creditRecord

        // serverConfig.default.incrementExecutionNonce()

        const execNonce = serverConfig.default.executionNonce
        const cpContract = new web3.eth.Contract(cpAbi, serverConfig.default.creditProtocolAddress)
        const privateKeyBuffer = Buffer.from(serverConfig.default.executionPrivateKey.slice(2), 'hex')
        const bytes32Memo = web3.utils.utf8ToHex(memo)

        // const cSigBuffers = decomposeSignatureToBytes(creditorSignature)//.map(piece => web3.utils.hexToBytes('0x' + piece.toString('hex')))
        // const dSigBuffers = decomposeSignatureToBytes(debtorSignature)//.map(piece => web3.utils.hexToBytes('0x' + piece.toString('hex')))

        let credV = web3.utils.toDecimal("0x" + creditorSignature.substr(128, 2))
        if (credV < 27) credV += 27
        credV = bignumToHexString(web3.utils.toBN(credV))
        let debtV = web3.utils.toDecimal("0x" + debtorSignature.substr(128, 2))
        if (debtV < 27) debtV += 27
        debtV = bignumToHexString(web3.utils.toBN(debtV))
        const cSig: [string, string, string] = ["0x" + creditorSignature.substr(0, 64), "0x" + creditorSignature.substr(64, 64), credV]
        const dSig: [string, string, string] = ["0x" + creditorSignature.substr(0, 64), "0x" + creditorSignature.substr(64, 64), debtV]

        // console.log(ucac, creditor, debtor, Math.floor(amount), cSigBuffers, dSigBuffers, bytes32Memo)
        // console.log(cSigBuffers[2].readUInt8(0))
        // const addressBuffer = ethUtil.pubToAddress( ethUtil.ecrecover(Buffer.from(hash, 'hex'), cSigBuffers[2].readUIntBE(0, 1), cSigBuffers[0], cSigBuffers[1]) )
        // console.log('CREDITOR', addressBuffer.toString('hex'), creditor)

        const callData = cpContract.methods.issueCredit('0x' + ucac, '0x' + creditor, '0x' + debtor, bignumToHexString(amount), cSig, dSig, bytes32Memo).encodeABI()

        // const estimatedGas = await cpContract.methods.issueCredit('0x' + ucac, '0x' + creditor, '0x' + debtor, bignumToHexString(amount), cSig, dSig, bytes32Memo).estimatedGas()
        // console.log('ESTIMATED GAS', estimatedGas)

        const rawTx = {
            nonce: execNonce,
            gasPrice: serverConfig.default.gasPrice * 1000,
            gasLimit: serverConfig.default.maxGas * 10,
            from: serverConfig.default.executionAddress,
            to: serverConfig.default.creditProtocolAddress,
            value: 0,
            chainId: 1, // 1 is the mainnet chainId
            data: callData
        }

        const tx = new Tx(rawTx)
        tx.sign(privateKeyBuffer)

        const serializedTx = tx.serialize()
        return web3.eth.sendRawTransaction(serializedTx).then(console.log)

        // const tx = {
        //     // nonce: execNonce,
        //     from: '0x' + serverConfig.default.executionAddress,
        //     gasPrice: web3.utils.numberToHex(serverConfig.default.gasPrice * 10000),
        //     gas: web3.utils.numberToHex(serverConfig.default.maxGas * 20),
        //     gasLimit: web3.utils.numberToHex(serverConfig.default.maxGas * 20),
        //     to: serverConfig.default.creditProtocolAddress,
        //     value: '0',
        //     chainId: 1, // 1 is the mainnet chainId
        //     data: callData
        // }

        // console.log(tx)

        // const signedTx = await web3.eth.accounts.signTransaction(tx, serverConfig.default.executionPrivateKey)
        // const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt', console.log)
        // return result

        function bignumToHexString(num) {
            const a = num.toString(16);
            return "0x" + '0'.repeat(64 - a.length) + a;
        }

        function fillBytes32(ascii) {
            // 66 instead of 64 to account for the '0x' prefix
            return ascii + '0'.repeat(66 - ascii.length);
        }
    },

    lndrLogs: () => {
        console.log('LOOKING FOR LOGS')
        const issueCreditSubscription = web3.eth.subscribe('logs', {
            fromBlock: serverConfig.default.scanStartBlock,
            address: serverConfig.default.creditProtocolAddress,
            topics: [serverConfig.default.issueCreditEvent]
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

        const issueCreditErrorSubscription = web3.eth.subscribe('logs', {
            fromBlock: serverConfig.default.scanStartBlock,
            address: '0x60ef3386514cc5a63a0be3beb3e447f614b09c68697f392e9a5b907f5dbd48b9',
            topics: [serverConfig.default.issueCreditEvent]
        })
        issueCreditErrorSubscription.on('data', console.log)
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
        return web3.eth.getTransactionCount(serverConfig.default.executionAddress)
    }
}

export default ethInterfaceRepo
