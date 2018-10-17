import { signatureToAddress } from '../utils/credit.protocol.util'
import { hexToBuffer, bufferToHex } from '../utils/buffer.util'
const ethUtil = require('ethereumjs-util')

export default class PayPalRequest {
  friend: string
  requestor: string
  paypalRequestSignature: string

  constructor(data) {
    this.friend = data.friend
    this.requestor = data.requestor
    this.paypalRequestSignature = data.paypalRequestSignature
  }

  signatureMatches() {
    const hashBuffer = Buffer.concat([
      hexToBuffer(this.friend),
      hexToBuffer(this.requestor)
    ])
    const hexHash = bufferToHex(ethUtil.sha3(hashBuffer))

    return signatureToAddress(hexHash, this.paypalRequestSignature) === this.requestor
  }
}
