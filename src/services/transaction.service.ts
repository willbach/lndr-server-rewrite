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
    const { creditor, debtor, memo, submitter, hash, signature, ucac } = record

    const nonce = await verifiedRepository.getNonce(creditor, debtor)[0] // only used to log
    console.log('NONCE FOR TX: ', nonce)

    if (hash !== record.generateHash()) {
      throw new Error('Bad hash included with credit record.')
    } else if (memo.length > 32) {
      throw new Error('Memo too long. Memos must be no longer than 32 characters.')
    } else if (submitter !== creditor && submitter !== debtor) {
      throw new Error('Submitter is not creditor nor debtor.')
    } else if (creditor === debtor) {
      throw new Error('Creditor and debtor cannot be equal.')
    } else if (!Object.values(serverConfig.lndrUcacAddrs).includes(ucac)) {
      throw new Error('Unrecognized UCAC address.')
    }

    const counterparty = submitter === creditor ? debtor : creditor
    const rawPending = await pendingRepository.lookupPending(hash)[0]

    if (rawPending) {
      const pendingCredit = new CreditRecord(rawPending, 'settlement')
      
      if (pendingCredit.signature !== record.signature) {
        const creditorSignature = record.submitter === record.creditor ? record.signature : pendingCredit.signature
        const debtorSignature = record.submitter === record.debtor ? record.signature : pendingCredit.signature
        
        const bilateralRecord = new BilateralCreditRecord({ creditRecord: record, creditorSignature, debtorSignature })

        if (!bilateralRecord.creditRecord.settlementAmount) {
          const web3Result = await ethereumInterface.finalizeTransaction(bilateralRecord)

          console.log('WEB3:', web3Result)
        }

        await verifiedRepository.insertCredit(bilateralRecord)
        await pendingRepository.deletePending(bilateralRecord.creditRecord.hash, false)

        if (recordNum === 0) {
          notificationsRepository.sendNotification(submitter, counterparty, 'CreditConfirmation')
        }
      } else {
        throw new Error('Signatures should not be the same for creditor and debtor.')
      }
    } else {
      const processedRecord = calculateSettlementCreditRecord(serverConfig, record)

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
      
      if (recordNum === 0) {
        notificationsRepository.sendNotification(submitter, counterparty, 'NewPendingCredit')
      }
    }
    
    return true
  },

  reject: async(rejectRequest: RejectRequest) => {
    const signerAddress = rejectRequest.getAddress()

    const rawPending = await pendingRepository.lookupPending(rejectRequest.hash)[0]

    if (!rawPending) {
      throw new Error('Hash does not match any pending record')
    }

    const pending = new CreditRecord(rawPending, 'settlement')

    if (signerAddress !== pending.creditor && signerAddress !== pending.debtor) {
      throw new Error('bad rejection sig')
    }

    const rejection = await pendingRepository.deletePending(rejectRequest.hash, true)

    const recipientAddress = signerAddress === pending.creditor ? pending.debtor : pending.creditor

    notificationsRepository.sendNotification(signerAddress, recipientAddress, 'PendingCreditRejection')

    return rejection
  },

  getTransactions: (address: string) => {
    const rawTransactions = verifiedRepository.lookupCreditByAddress(address)

    return rawTransactions.map(tx => new IssueCreditLog(tx, 'fromDb'))
  },

  getPendingTransactions: async(address: string) => {
    const rawPending = pendingRepository.lookupPendingByAddress(address, false)

    return rawPending.map(tx => new CreditRecord(tx, 'pendingTx'))
  }
}

function calculateSettlementCreditRecord(config: ServerConfig, record: CreditRecord): CreditRecord {
  const { amount, ucac, settlementCurrency } = record

  if (settlementCurrency === 'ETH') {
    const noAdjustment = {
      idr: true,
      jpy: true,
      krw: true,
      vnd: true
    }
    
    let currency = Object.keys(serverConfig.lndrUcacAddrs).find(key => serverConfig.lndrUcacAddrs[key] === ucac)
    if (currency === undefined) {
      currency = 'usd'
    }
    const priceAdjustmentForCents = noAdjustment[currency] ? 1 : 100
    const currencyPerEth = config.ethereumPrices[currency] * priceAdjustmentForCents
    const rawSettlementAmount = amount / currencyPerEth * Math.pow(10, 18)

    record.settlementAmount =  rawSettlementAmount - (rawSettlementAmount % Math.pow(10, 6))
    record.settlementBlocknumber = config.latestBlockNumber

    return record
  } else {
    return record
  }
}

// calculateSettlementCreditRecord :: ServerConfig -> CreditRecord -> CreditRecord
// calculateSettlementCreditRecord _ cr@(CreditRecord _ _ _ _ _ _ _ _ _ Nothing _ _) = cr
// calculateSettlementCreditRecord config cr@(CreditRecord _ _ amount _ _ _ _ _ ucac (Just "ETH") _ _) =
//     let blockNumber = latestBlockNumber config
//         prices = ethereumPrices config
//         priceAdjustmentForCents = 100
//         currencyPerEth = case B.lookupR ucac (lndrUcacAddrs config) of
//             Just "AUD" -> aud prices * priceAdjustmentForCents
//             Just "CAD" -> cad prices * priceAdjustmentForCents
//             Just "CHF" -> chf prices * priceAdjustmentForCents
//             Just "CNY" -> cny prices * priceAdjustmentForCents
//             Just "DKK" -> dkk prices * priceAdjustmentForCents
//             Just "EUR" -> eur prices * priceAdjustmentForCents
//             Just "GBP" -> gbp prices * priceAdjustmentForCents
//             Just "HKD" -> hkd prices * priceAdjustmentForCents
//             Just "IDR" -> idr prices
//             Just "ILS" -> ils prices * priceAdjustmentForCents
//             Just "INR" -> inr prices * priceAdjustmentForCents
//             Just "JPY" -> jpy prices
//             Just "KRW" -> krw prices
//             Just "MYR" -> myr prices * priceAdjustmentForCents
//             Just "NOK" -> nok prices * priceAdjustmentForCents
//             Just "NZD" -> nzd prices * priceAdjustmentForCents
//             Just "PLN" -> pln prices * priceAdjustmentForCents
//             Just "RUB" -> rub prices * priceAdjustmentForCents
//             Just "SEK" -> sek prices * priceAdjustmentForCents
//             Just "SGD" -> sgd prices * priceAdjustmentForCents
//             Just "THB" -> thb prices * priceAdjustmentForCents
//             Just "TRY" -> try prices * priceAdjustmentForCents
//             Just "USD" -> usd prices * priceAdjustmentForCents
//             Just "VND" -> vnd prices
//             Nothing    -> error "ucac not found"
//         settlementAmountRaw = floor $ fromIntegral amount / currencyPerEth * 10 ^ 18
//     in cr { settlementAmount = Just $ roundToMegaWei settlementAmountRaw
//           , settlementBlocknumber = Just blockNumber
//           }
// calculateSettlementCreditRecord config cr@(CreditRecord _ _ amount _ _ _ _ _ ucac (Just "DAI") _ _) =
//     let blockNumber = latestBlockNumber config
//         prices = ethereumPrices config
//         priceAdjustmentForCents = 100
//         currencyPerDai = case B.lookupR ucac (lndrUcacAddrs config) of
//             Just "AUD" -> aud prices * priceAdjustmentForCents
//             Just "CAD" -> cad prices * priceAdjustmentForCents
//             Just "CHF" -> chf prices * priceAdjustmentForCents
//             Just "CNY" -> cny prices * priceAdjustmentForCents
//             Just "DKK" -> dkk prices * priceAdjustmentForCents
//             Just "EUR" -> eur prices * priceAdjustmentForCents
//             Just "GBP" -> gbp prices * priceAdjustmentForCents
//             Just "HKD" -> hkd prices * priceAdjustmentForCents
//             Just "IDR" -> idr prices
//             Just "ILS" -> ils prices * priceAdjustmentForCents
//             Just "INR" -> inr prices * priceAdjustmentForCents
//             Just "JPY" -> jpy prices
//             Just "KRW" -> krw prices
//             Just "MYR" -> myr prices * priceAdjustmentForCents
//             Just "NOK" -> nok prices * priceAdjustmentForCents
//             Just "NZD" -> nzd prices * priceAdjustmentForCents
//             Just "PLN" -> pln prices * priceAdjustmentForCents
//             Just "RUB" -> rub prices * priceAdjustmentForCents
//             Just "SEK" -> sek prices * priceAdjustmentForCents
//             Just "SGD" -> sgd prices * priceAdjustmentForCents
//             Just "THB" -> thb prices * priceAdjustmentForCents
//             Just "TRY" -> try prices * priceAdjustmentForCents
//             Just "USD" -> usd prices * priceAdjustmentForCents
//             Just "VND" -> vnd prices
//             Nothing    -> error "ucac not found"
//         settlementAmountRaw = floor $ fromIntegral amount / currencyPerDai
//     in cr { settlementAmount = Just $ roundToMegaWei settlementAmountRaw
//             , settlementBlocknumber = Just blockNumber
//             }
// calculateSettlementCreditRecord _ cr@(CreditRecord _ _ _ _ _ _ _ _ _ (_) _ _) = cr
