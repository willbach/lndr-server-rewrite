import CreditRecord from './credit-record'

export default class BilateralCreditRecord {
  creditRecord: CreditRecord
  creditorSignature: string
  debtorSignature: string
  txHash?: string

  constructor(data) {
    this.creditRecord = data.creditRecord
    this.creditorSignature = data.creditorSignature
    this.debtorSignature = data.debtorSignature
    this.txHash = data.txHash
  }
}
