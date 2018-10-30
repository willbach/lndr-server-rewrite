import { signatureToAddress } from '../utils/credit.protocol.util'
import { hexToBuffer, bufferToHex } from '../utils/buffer.util'
const ethUtil = require('ethereumjs-util')

export default class VerifySettlementRequest {
  creditHash: string
  txHash: string
  creditorAddress: string
  signature: string

  constructor(data) {
    this.creditHash = data.creditHash
    this.txHash = data.txHash
    this.creditorAddress = data.creditorAddress
    this.signature = data.signature
  }

  signatureMatches() {
    const hashBuffer = Buffer.concat([
      hexToBuffer(this.creditHash),
      hexToBuffer(this.txHash),
      hexToBuffer(this.creditorAddress)
    ])
    const hexHash = bufferToHex(ethUtil.sha3(hashBuffer))

    return signatureToAddress(hexHash, this.signature, false) === this.creditorAddress
  }
}
