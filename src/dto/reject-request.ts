import { signatureToAddress } from 'utils/credit.protocol.util'

export default class RejectRequest {
  hash: string
  signature: string

  constructor(data) {
    this.hash = data.hash
    this.signature = data.signature
  }

  getAddress() {
    return signatureToAddress(this.hash, this.signature)
  }
}
