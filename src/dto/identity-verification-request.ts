import IdentityDocument from 'dto/identity-document'
import RequiredIdentityDocuments from 'dto/required-identity-documents'
import IdentityVerificationInfo from 'dto/identity-verification-info'

export default class IdentifyVerificationRequest {
  email: string
  externalUserId: string
  info: IdentityVerificationInfo
  requiredIdDocs: RequiredIdentityDocuments
  identitySignature: string
  idDocs: [IdentityDocument]

  constructor(data) {
    this.email = data.email
    this.externalUserId = data.externalUserId
    this.info = data.info
    this.requiredIdDocs = new RequiredIdentityDocuments(data.requiredIdDocs)
    this.identitySignature = data.identitySignature
    this.idDocs = data.idDocs
  }
}
