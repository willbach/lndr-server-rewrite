import { signatureToAddress } from 'utils/credit.protocol.util'
import { hexToBuffer, utf8ToBuffer } from 'utils/buffer.util'

export default class NickRequest {
  addr: string
  nick: string
  signature: string

  constructor(data) {
    this.addr = data.addr
    this.nick = data.nick
    this.signature = data.signature
  }

  signatureMatches() {
    const hashBuffer = Buffer.concat([
      hexToBuffer(this.addr),
      utf8ToBuffer(this.nick)
    ])

    return signatureToAddress(hashBuffer.toString('hex'), this.signature) === this.addr
  }
}
