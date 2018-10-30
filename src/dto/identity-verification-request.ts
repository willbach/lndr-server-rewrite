import IdentityDocument from '../dto/identity-document'
import RequiredIdentityDocuments from '../dto/required-identity-documents'
import IdentityVerificationInfo from '../dto/identity-verification-info'

import { signatureToAddress } from '../utils/credit.protocol.util'
import { hexToBuffer, bufferToHex } from '../utils/buffer.util'
const ethUtil = require('ethereumjs-util')

export default class IdentityVerificationRequest {
  email: string
  externalUserId: string
  info: IdentityVerificationInfo
  requiredIdDocs: RequiredIdentityDocuments
  identitySignature?: string
  idDocs?: [IdentityDocument]

  constructor(data) {
    this.email = data.email
    this.externalUserId = data.externalUserId
    this.info = data.info
    this.requiredIdDocs = new RequiredIdentityDocuments(data.requiredIdDocs)
    this.identitySignature = data.identitySignature
    this.idDocs = data.idDocs
  }

  signatureMatches() {
    const hashBuffer = Buffer.concat([
      hexToBuffer(this.externalUserId)
    ])
    const hexHash = bufferToHex(ethUtil.sha3(hashBuffer))

    if (!this.identitySignature) {
      return false
    }

    return signatureToAddress(hexHash, this.identitySignature, false) === this.externalUserId
  }
}
