import { signatureToAddress } from 'utils/credit.protocol.util'
import { hexToBuffer, int32ToBuffer } from 'utils/buffer.util'
import ethUtil from 'ethereumjs-util'

export default class CreditRecord {
  creditor: string
  debtor: string
  amount: number
  memo: string
  submitter: string
  nonce: number
  hash: string
  signature: string
  ucac: string
  settlementCurrency?: string
  settlementAmount?: number
  settlementBlocknumber?: number

  constructor(data: any, type?: string) {
    this.creditor = data.creditor
    this.debtor = data.debtor
    this.memo = data.memo
    this.submitter = data.submitter
    this.nonce = data.nonce
    this.signature = data.signature
    this.ucac = data.ucac

    if (type === 'settlement') {
      this.amount = data.pending_credits.amount
      this.hash = data.pending_credits.hash
      this.settlementCurrency = data.settlements.currency
      this.settlementAmount = data.settlements.amount
      this.settlementBlocknumber = data.settlements.blocknumber

    } else if(type === 'pendingTx') {
      this.amount = data.pending_credits.amount
      this.hash = data.pending_credits.hash
      this.settlementCurrency = data.settlement_currency
      this.settlementAmount = data.settlementAmount
      this.settlementBlocknumber = data.settlementBlocknumber

    } else { //this is for incoming records
      this.amount = data.amount
      this.hash = data.hash
      this.settlementCurrency = data.settlementCurrency
    }
  }

  signatureMatches() {
    return signatureToAddress(this.hash, this.signature) === this.submitter
  }

  generateHash() {
    const buffer = Buffer.concat([
      hexToBuffer(this.ucac),
      hexToBuffer(this.creditor),
      hexToBuffer(this.debtor),
      int32ToBuffer(this.amount),
      int32ToBuffer(this.nonce)
    ])

    return ethUtil.sha3(buffer).toString('hex')
  }
}
