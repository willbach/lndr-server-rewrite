import { signatureToAddress } from '../utils/credit.protocol.util'
const ethUtil = require('ethereumjs-util')

export default class ProfilePhotoRequest {
  image: string
  signature: string

  constructor(data) {
    this.image = data.image
    this.signature = data.signature
  }

  getAddress() {
    const hashBuffer = ethUtil.sha3(this.image)
    return signatureToAddress(hashBuffer.toString('hex'), this.signature)
  }
}