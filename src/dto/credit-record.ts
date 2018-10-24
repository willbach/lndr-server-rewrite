import { signatureToAddress } from '../utils/credit.protocol.util'
import { hexToBuffer, int32ToBuffer, bufferToHex } from '../utils/buffer.util'
const ethUtil = require('ethereumjs-util')

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
    this.creditor = this.strip0x(data.creditor)
    this.debtor = this.strip0x(data.debtor)
    this.submitter = this.strip0x(data.submitter)
    this.ucac = this.strip0x(data.ucac)
    this.memo = data.memo
    this.nonce = data.nonce
    this.signature = data.signature
    this.amount = data.amount
    this.hash = data.hash

    if (type === 'settlement') {
      this.settlementCurrency = data.settlement_currency
      this.settlementAmount = data.settlement_amount
      this.settlementBlocknumber = data.settlement_blocknumber

    } else if(type === 'pendingTx') {
      this.settlementCurrency = data.settlement_currency
      this.settlementAmount = data.settlementAmount
      this.settlementBlocknumber = data.settlementBlocknumber

    } else { //this is for incoming records
      this.settlementCurrency = data.settlement_currency
    }
  }

  strip0x(address) {
    if (address.substr(0, 2) === '0x') {
      return address.slice(2)
    }
    return address
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

    return bufferToHex(ethUtil.sha3(buffer))
  }
}
