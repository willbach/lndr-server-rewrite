import RequiredIdentityDocuments from '../dto/required-identity-documents'
import IdentityVerificationInfo from '../dto/identity-verification-info'

export default class IdentityVerificationResponse {
  id: string
  createdAt: string
  inspectionId: string
  clientId: string
  jobId: string
  externalUserId: string
  info: IdentityVerificationInfo
  email: string
  env: string
  requiredIdDocs: RequiredIdentityDocuments

  constructor(data) {
    this.id = data.id
    this.createdAt = data.createdAt
    this.inspectionId = data.inspectionId
    this.clientId = data.clientId
    this.jobId = data.jobId
    this.externalUserId = data.externalUserId
    this.info = new IdentityVerificationInfo(data.info)
    this.email = data.email
    this.env = data.env
    this.requiredIdDocs = new RequiredIdentityDocuments(data.requiredIdDocs)
  }
}

