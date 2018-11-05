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
        amount: data.amount,
        creditor: data.creditor,
        debtor: data.debtor,
        hash: data.hash,
        memo: data.memo,
        nonce: data.nonce,
        settlementAmount: data.settlement_amount ? data.settlement_amount : data.settlementAmount,
        settlementBlocknumber: data.blocknumber,
        settlementCurrency: data.currency,
        signature: data.creditor_signature,
        submitter: data.submitter,
        ucac: data.ucac
      })
    }

    this.creditorSignature = data.creditorSignature ? data.creditorSignature : data.creditor_signature
    this.debtorSignature = data.debtorSignature ? data.debtorSignature : data.debtor_signature
    this.txHash = data.tx_hash
  }
}
