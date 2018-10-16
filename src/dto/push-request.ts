import { signatureToAddress } from 'utils/credit.protocol.util'
import ethUtil from 'ethereumjs-util'
import { bufferToHex, hexToBuffer, utf8ToBuffer } from 'utils/buffer.util'

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

    return signatureToAddress(hexHash, this.signature) === this.address
  }
}