import BilateralCreditRecord from '../dto/bilateral-credit-record'
import CreditRecord from '../dto/credit-record'
import VerifySettlementRequest from '../dto/verify-settlement-request'

import pendingRepository from '../repositories/pending.repository'
import { stripHexPrefix } from '../utils/buffer.util'
import verifiedRepository from '../repositories/verified.repository'

export default {
  getPendingSettlements: async (address: string) => {
    const rawBilateralSettlements = await verifiedRepository.lookupSettlementCreditByAddress(address)
    const rawUnilateralSettlements = await pendingRepository.lookupPendingByAddress(address, true)

    const bilateralSettlements = rawBilateralSettlements.map((settlement) => new BilateralCreditRecord(settlement))
    const unilateralSettlements = rawUnilateralSettlements.map((settlement) => new CreditRecord(settlement, 'settlement'))

    return { bilateralSettlements, unilateralSettlements }
  },

  getTxHash: (creditHash: string) => verifiedRepository.txHashByCreditHash(creditHash),

  verifySettlement: (verification: VerifySettlementRequest) => verifiedRepository.updateSettlementTxHash(stripHexPrefix(verification.txHash), verification.creditHash)
}
