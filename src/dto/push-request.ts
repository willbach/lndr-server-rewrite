import { bufferToHex, hexToBuffer, utf8ToBuffer } from '../utils/buffer.util'
import { signatureToAddress } from '../utils/credit.protocol.util'
const ethUtil = require('ethereumjs-util')

export default class PushRequest {
  channelID: string
  platform: string
  address: string
  signature: string

  constructor(data) {
    this.channelID = data.channelID
    this.platform = data.platform
    this.address = data.address
    this.signature = data.signature
  }

  signatureMatches() {
    const hashBuffer = Buffer.concat([
      utf8ToBuffer(this.platform),
      utf8ToBuffer(this.channelID),
      hexToBuffer(this.address)
    ])
    const hexHash = bufferToHex(ethUtil.sha3(hashBuffer))

    return signatureToAddress(hexHash, this.signature, false) === this.address
  }
}
