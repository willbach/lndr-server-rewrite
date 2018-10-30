import { signatureToAddress } from '../utils/credit.protocol.util'
import { hexToBuffer, bufferToHex } from '../utils/buffer.util'
const ethUtil = require('ethereumjs-util')

export default class VerificationStatusRequest {
  user: string
  verificationStatusSignature: string

  constructor(data) {
    this.user = data.user
    this.verificationStatusSignature = data.verificationStatusSignature
  }

  signatureMatches() {
    const hashBuffer = Buffer.concat([
      hexToBuffer(this.user)
    ])
    const hexHash = bufferToHex(ethUtil.sha3(hashBuffer))
    
    return signatureToAddress(hexHash, this.verificationStatusSignature, false) === this.user
  }
}