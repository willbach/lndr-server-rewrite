import identityRepository from '../repositories/identity.repository'

import IdentityVerificationRequest from "dto/identity-verification-request"
import VerificationStatusRequest from "dto/verification-status-request"
import VerificationStatusEntry from '../dto/verification-status-entry'

export default {
  registerUser: async(verificationRequest: IdentityVerificationRequest) => {
    const documents = verificationRequest.idDocs

    if (!documents) {
      throw new Error('No documents attached')
    }

    const verificationResult = await identityRepository.sendVerificationRequest(verificationRequest)

    return Promise.all(documents.map(document => identityRepository.sendVerificationDocument(verificationResult.id, document)))
  },

  handleCallback: (status: any) => {
    return identityRepository.addVerificationStatus(status.externalUserId, status.applicantId, status.review.reviewAnswer)
  },

  checkStatus: async(statusRequest: VerificationStatusRequest) => {
    const storedStatus = await identityRepository.lookupVerificationStatus(statusRequest.user)
    if (storedStatus && storedStatus.length > 0 && storedStatus[0].status) {
      return new VerificationStatusEntry(storedStatus[0])
    } else if(storedStatus && storedStatus.length > 0 && storedStatus[0].applicant_id) {
      const checkedStatus = await identityRepository.getVerificationStatus(storedStatus.applicant_id)

      if (checkedStatus && checkedStatus.review && checkedStatus.review.reviewAnswer) {
        await identityRepository.addVerificationStatus(checkedStatus.externalUserId, checkedStatus.applicantId, checkedStatus.review.reviewAnswer)

        return new VerificationStatusEntry({
          address: checkedStatus.externalUserId,
          applicant_id: checkedStatus.applicantId,
          status: checkedStatus.review.reviewAnswer
        })
      } else {
        throw new Error('Unable to get applicant status')
      }
    } else {
      throw new Error('Unable to get applicant status')
    }
  }
}

// IdentityStatusReview { reviewAnswer :: Text
//   , clientComment :: Text
//   , moderationComment :: Maybe Text
//   , rejectLabels :: Maybe [String]
//   , reviewRejectType :: Maybe Text
// }

// IdentityVerificationStatus { applicantId :: Text
//   , inspectionId :: Text
//   , correlationId :: Text
//   , jobId :: Text
//   , externalUserId :: Address
//   , success :: Bool
//   , details :: Maybe Text
//   , _type :: Text
//   , review :: IdentityStatusReview
// }
