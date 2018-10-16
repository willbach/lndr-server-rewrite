export default class CreditRecord {
  creditor: string
  debtor: string
  amount: string
  memo: string
  submitter: string
  nonce: number
  hash: string
  signature: string
  ucac: string
  settlementCurrency?: string
  settlementAmount?: number
  settlementBlocknumber?: number

  constructor(data) {
    this.creditor = data.creditor
    this.debtor = data.debtor
    this.amount = data.amount
    this.memo = data.memo
    this.submitter = data.submitter
    this.nonce = data.nonce
    this.hash = data.hash
    this.signature = data.signature
    this.ucac = data.ucac
    this.settlementCurrency = data.settlementCurrency
    this.settlementAmount = data.settlementAmount
    this.settlementBlocknumber = data.settlementBlocknumber
  }
}
