import pendingRepository from 'repositories/pending.repository'
import verifiedRepository from 'repositories/verified.repository'

import VerifySettlementRequest from 'dto/verify-settlement-request'
import CreditRecord from 'dto/credit-record'
import BilateralCreditRecord from 'dto/bilateral-credit-record'

export default {
  getPendingSettlements: async(address: string) => {
    const rawUnilateralSettlements = await pendingRepository.lookupPendingByAddress(address, true)
    const rawBilateralSettlements = await verifiedRepository.lookupSettlementCreditByAddress(address)

    const unilateralSettlements = rawUnilateralSettlements.map(settlement => new CreditRecord(settlement, 'settlement'))
    const bilateralSettlements = rawBilateralSettlements.map(settlement => new BilateralCreditRecord(settlement))

    return { unilateralSettlements, bilateralSettlements }
  },

  verifySettlement: (verification: VerifySettlementRequest) => {
    return verifiedRepository.updateSettlementTxHash(verification.txHash, verification.creditHash)
  },

  getTxHash: (creditHash: string) => {
    return verifiedRepository.txHashByCreditHash(creditHash)
  }
}
