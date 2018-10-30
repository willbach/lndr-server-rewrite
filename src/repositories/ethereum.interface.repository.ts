const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const fs = require('fs')
const path = require('path')
const ethUtil = require('ethereumjs-util')

import db from '../db'
const serverConfig = require('../services/config.service')
import BilateralCreditRecord from '../dto/bilateral-credit-record'
import IssueCreditLog from '../dto/issue-credit-log'

import { decomposeSignatureToBytes32, bignumToHexString, signatureToAddress } from '../utils/credit.protocol.util'
import { stripHexPrefix } from '../utils/buffer.util'

// const web3 = new Web3(new Web3.providers.HttpProvider(serverConfig.web3Url))
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
const rawAbi = fs.readFileSync(path.join(__dirname, '../../data/CreditProtocol.abi.json'), {encoding: 'utf8'})
const cpAbi = JSON.parse(rawAbi)

const ethInterfaceRepo = {
    finalizeTransaction: async(record: BilateralCreditRecord) => {
        const { creditRecord, creditorSignature, debtorSignature } = record
        const { creditor, debtor, amount, memo, ucac, nonce } = creditRecord

        const execNonce = await new Promise((resolve, reject) => web3.eth.getTransactionCount(`0x${serverConfig.default.executionAddress}`, (e, data) => e ? reject(e) : resolve(data)))
        const privateKeyBuffer = Buffer.from(serverConfig.default.executionPrivateKey.slice(2), 'hex')
        
        const CreditProtocolContract =  web3.eth.contract(cpAbi)
        const contractInstance:any = await new Promise((resolve, reject) => {
            CreditProtocolContract.at(serverConfig.default.creditProtocolAddress, (e, data) => e ? reject(e) : resolve(data))
        })
        
        const bytes32Memo = web3.fromAscii(memo)
        const cSig = decomposeSignatureToBytes32(creditorSignature)
        const dSig = decomposeSignatureToBytes32(debtorSignature)
        
        const callData = contractInstance.issueCredit.getData(`0x${ucac}`, `0x${creditor}`, `0x${debtor}`, bignumToHexString(amount), [cSig.r, cSig.s, cSig.v], [dSig.r, dSig.s, dSig.v], bytes32Memo)

        // console.log(creditorSignature, '\n', debtorSignature)
        // console.log('SIGNATURES MATCH:', creditor === signatureToAddress(creditRecord.hash, creditorSignature), debtor === signatureToAddress(creditRecord.hash, debtorSignature))
        // console.log(`0x${ucac}`, `0x${creditor}`, `0x${debtor}`, bignumToHexString(amount), [cSig.r, cSig.s, cSig.v], [dSig.r, dSig.s, dSig.v], bytes32Memo)
        // console.log('CALL DATA', callData)
        // console.log('EXEC NONCE', execNonce)

        var rawTx = {
            nonce: execNonce,
            gasPrice: serverConfig.default.gasPrice,
            gasLimit: serverConfig.default.maxGas,
            to: serverConfig.default.creditProtocolAddress,
            from: `0x${serverConfig.default.executionAddress}`,
            data: callData,
            value: '0x00',
            chainId: 1
        }
    
        var tx = new Tx(rawTx)
        tx.sign(privateKeyBuffer)
        var serializedTx = tx.serialize()

        // const nonceResult = await new Promise((resolve, reject) => {
        //     contractInstance.getNonce(`0x${creditor}`, `0x${debtor}`, (err, data) => {
        //         if(err) reject(err)
        //         else resolve(data)
        //     })
        // })

        return new Promise((resolve, reject) => {
            web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
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

    verifySettlementPayment: async(txHash: string, creditor: string, debtor: string, amount: number, settlementCurrency: string) => {
        const tx = await new Promise((resolve, reject) => web3.eth.getTransaction(`0x${txHash}`, (e, data) => e ? reject(e) : resolve(data))) as any

        if (!tx || !tx.value) {
            throw new Error('transaction not found, tx_hash: ' + txHash)
        }

        let creditorMatch = creditor === stripHexPrefix(tx.from), debtorMatch, valueMatch, txValue

        if (settlementCurrency === 'DAI') {
            txValue = parseInt(tx.input.slice(114), 16)
            debtorMatch = debtor === tx.input.slice(34, 74)
            valueMatch = txValue === amount
        } else {
            txValue = tx.value.toNumber()
            debtorMatch = debtor === stripHexPrefix(tx.to)
            valueMatch = amount === txValue
        }

        if (!creditorMatch) {
            throw new Error('Bad from match, hash: ' + txHash + ' tx value: ' + txValue + ' settlement value: ' + amount)
        } else if (!debtorMatch) {
            throw new Error('Bad to match, hash: ' + txHash + ' tx value: ' + txValue + ' settlement value: ' + amount)
        } else if (!valueMatch) {
            throw new Error('Bad value match, hash: ' + txHash + ' tx value: ' + txValue + ' settlement value: ' + amount)
        }

        return true
    },

    currentBlockNumber: () => {
        return new Promise((resolve, reject) => web3.eth.getBlockNumber((e, data) => e ? reject(e) : resolve(data))) as any
    },

    currentExecutionNonce: () => {
        return new Promise((resolve, reject) => web3.eth.getTransactionCount(serverConfig.default.executionAddress, (e, data) => e ? reject(e) : resolve(data))) as any
    }
}

export default ethInterfaceRepo
