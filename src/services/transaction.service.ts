import pendingRepository from '../repositories/pending.repository'
import verifiedRepository from '../repositories/verified.repository'
import notificationsRepository from '../repositories/notifications.repository'
import ethereumInterface from '../repositories/ethereum.interface.repository'
import serverConfig, { ServerConfig } from '../services/config.service'

import RejectRequest from '../dto/reject-request'
import CreditRecord from '../dto/credit-record'
import IssueCreditLog from '../dto/issue-credit-log'
import BilateralCreditRecord from '../dto/bilateral-credit-record'
import friendsRepository from '../repositories/friends.repository';

export default {
  submitCredit: async(record: CreditRecord, recordNum: number) => {
    const { creditor, debtor, memo, submitter, hash, ucac } = record

    if (hash !== record.generateHash()) {
      throw new Error('Bad hash included with credit record.')
    } else if (memo.length > 32) {
      throw new Error('Memo too long. Memos must be no longer than 32 characters.')
    } else if (submitter !== creditor && submitter !== debtor) {
      throw new Error('Submitter is not creditor nor debtor.')
    } else if (creditor === debtor) {
      throw new Error('Creditor and debtor cannot be equal.')
    } else if (!Object.values(serverConfig.lndrUcacAddrs).includes('0x' + ucac)) {
      throw new Error('Unrecognized UCAC address.')
    }

    const counterparty = submitter === creditor ? debtor : creditor
    const rawPending = await pendingRepository.lookupPending(hash)

    if (rawPending) {
      const pendingCredit = new CreditRecord(rawPending, 'settlement')
      
      if (pendingCredit.signature !== record.signature) {
        const creditorSignature = record.submitter === record.creditor ? record.signature : pendingCredit.signature
        const debtorSignature = record.submitter === record.debtor ? record.signature : pendingCredit.signature
        
        const bilateralRecord = new BilateralCreditRecord({ creditRecord: record, creditorSignature, debtorSignature })
        
        if (!pendingCredit.settlementAmount) {
          const web3Result = await ethereumInterface.finalizeTransaction(bilateralRecord)
          console.log('WEB3:', web3Result)
        }

        bilateralRecord.creditRecord.settlementAmount = pendingCredit.settlementAmount
        bilateralRecord.creditRecord.settlementCurrency = pendingCredit.settlementCurrency
        bilateralRecord.creditRecord.settlementBlocknumber = pendingCredit.settlementBlocknumber

        await verifiedRepository.insertCredit(bilateralRecord)
        await pendingRepository.deletePending(bilateralRecord.creditRecord.hash, false)

        if (recordNum === 0) {
          notificationsRepository.sendNotification(submitter, counterparty, 'CreditConfirmation')
        }
      } else {
        throw new Error('Signatures should not be the same for creditor and debtor.')
      }
    } else {
      const processedRecord = await calculateSettlementCreditRecord(serverConfig, record)

      const existingPending = await pendingRepository.lookupPendingByAddresses(creditor, debtor)
      if (recordNum === 0 && existingPending.length > 0) {
        throw new Error('A pending credit record already exists for the two users.')
      }

      const existingPendingSettlement = await pendingRepository.lookupPendingSettlementByAddresses(creditor, debtor)
      if (recordNum === 0 && existingPendingSettlement.length > 0) {
        throw new Error('An unverified settlement credit record already exists for the two users.')
      }

      await friendsRepository.addFriends(creditor, debtor)
      await friendsRepository.addFriends(debtor, creditor)
      await pendingRepository.insertPending(processedRecord)

      if (processedRecord.settlementAmount) {
        await pendingRepository.insertSettlementData(processedRecord)
      }
      
      if (recordNum === 0) {
        notificationsRepository.sendNotification(submitter, counterparty, 'NewPendingCredit')
      }
    }
    
    return true
  },

  reject: async(rejectRequest: RejectRequest) => {
    const signerAddress = rejectRequest.getAddress()

    const rawPending = await pendingRepository.lookupPending(rejectRequest.hash)

    if (!rawPending) {
      throw new Error('Hash does not match any pending record')
    }

    const pending = new CreditRecord(rawPending)

    if (signerAddress !== pending.creditor && signerAddress !== pending.debtor) {
      throw new Error('bad rejection sig')
    }

    const rejection = await pendingRepository.deletePending(rejectRequest.hash, false)

    const recipientAddress = signerAddress === pending.creditor ? pending.debtor : pending.creditor

    notificationsRepository.sendNotification(signerAddress, recipientAddress, 'PendingCreditRejection')

    return rejection
  },

  getTransactions: async(address: string) => {
    const rawTransactions = await verifiedRepository.lookupCreditByAddress(address)
    return rawTransactions.map(tx => new IssueCreditLog(tx))
  },

  getPendingTransactions: async(address: string) => {
    const rawPending = await pendingRepository.lookupPendingByAddress(address, false)
    return rawPending.map(tx => new CreditRecord(tx, 'pendingTx'))
  }
}

function calculateSettlementCreditRecord(config: ServerConfig, record: CreditRecord): CreditRecord {
  const { amount, ucac, settlementCurrency } = record

  const noAdjustment = { idr: true, jpy: true, krw: true, vnd: true }

  let currency = Object.keys(config.lndrUcacAddrs).find(key => config.lndrUcacAddrs[key] === `0x${ucac}`)
  if (currency === undefined) {
    currency = 'usd'
  }
  const priceAdjustmentForCents = noAdjustment[currency] ? 1 : 100

  if (settlementCurrency === 'ETH') {
    const currencyPerEth = config.ethereumPrices[currency.toUpperCase()] * priceAdjustmentForCents
    const rawSettlementAmount = amount / currencyPerEth * Math.pow(10, 18)

    record.settlementAmount =  rawSettlementAmount - (rawSettlementAmount % Math.pow(10, 6))
    record.settlementBlocknumber = config.latestBlockNumber
  } else if (settlementCurrency === 'DAI') {
    // this code can be copied for any stable coin, assumed to be 1 DAI to 1 USD
    const currencyPerDAI = config.ethereumPrices[currency.toUpperCase()] / config.ethereumPrices['USD']
    const rawSettlementAmount = amount / currencyPerDAI * Math.pow(10, 18)

    record.settlementAmount =  rawSettlementAmount - (rawSettlementAmount % Math.pow(10, 6))
    record.settlementBlocknumber = config.latestBlockNumber
  }

  return record
}
