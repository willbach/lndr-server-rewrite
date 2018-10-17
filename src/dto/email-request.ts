import { signatureToAddress } from '../utils/credit.protocol.util'
import { hexToBuffer, utf8ToBuffer } from '../utils/buffer.util'

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

    return signatureToAddress(hashBuffer.toString('hex'), this.signature) === this.addr
  }
}
