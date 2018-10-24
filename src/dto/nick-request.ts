import { signatureToAddress } from '../utils/credit.protocol.util'
import { hexToBuffer, utf8ToBuffer, bufferToHex } from '../utils/buffer.util'
const ethUtil = require('ethereumjs-util')

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
    const hash = bufferToHex(ethUtil.sha3(hashBuffer))
    
    return signatureToAddress(hash, this.signature) === this.addr
  }
}
