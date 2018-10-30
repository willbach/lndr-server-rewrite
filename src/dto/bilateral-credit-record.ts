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
        amount: data.amount,
        memo: data.memo,
        submitter: data.submitter,
        nonce: data.nonce,
        hash: data.hash,
        signature: data.creditor_signature,
        ucac: data.ucac,
        settlementCurrency: data.currency,
        settlementAmount: data.settlement_amount ? data.settlement_amount : data.settlementAmount,
        settlementBlocknumber: data.blocknumber,
      })
    }

    this.creditorSignature = data.creditorSignature ? data.creditorSignature : data.creditor_signature
    this.debtorSignature = data.debtorSignature ? data.debtorSignature : data.debtor_signature
    this.txHash = data.tx_hash
  }
}
