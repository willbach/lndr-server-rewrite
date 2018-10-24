import { signatureToAddress } from '../utils/credit.protocol.util'
import { hexToBuffer, utf8ToBuffer, bufferToHex } from '../utils/buffer.util'
const ethUtil = require('ethereumjs-util')

export default class EmailRequest {
  addr: string
  email: string
  signature: string

  constructor(data) {
    this.addr = data.addr
    this.email = data.email
    this.signature = data.signature
  }

  signatureMatches() {
    const hashBuffer = Buffer.concat([
      hexToBuffer(this.addr),
      utf8ToBuffer(this.email)
    ])
    const hash = bufferToHex(ethUtil.sha3(hashBuffer))

    return signatureToAddress(hash, this.signature) === this.addr
  }
}
