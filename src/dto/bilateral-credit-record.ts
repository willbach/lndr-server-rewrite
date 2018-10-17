import CreditRecord from './credit-record'

export default class BilateralCreditRecord {
  creditRecord: CreditRecord
  creditorSignature: string
  debtorSignature: string
  txHash?: string

  constructor(data) {
    if (data.creditRecord instanceof CreditRecord) {
      this.creditRecord = data.creditRecord
    } else {
      this.creditRecord = new CreditRecord({
        creditor: data.creditor,
        debtor: data.debtor,
        amount: data.verified_credits.amount,
        memo: data.memo,
        submitter: data.submitter,
        nonce: data.nonce,
        hash: data.verified_credits.hash,
        signature: data.creditor_signature,
        ucac: data.ucac,
        settlementCurrency: data.settlements.currency,
        settlementAmount: data.settlements.amount,
        settlementBlocknumber: data.settlements.blocknumber,
      })
    }
    
    this.creditorSignature = data.creditor_signature
    this.debtorSignature = data.debtor_signature
    this.txHash = data.settlements.tx_hash
  }
}
