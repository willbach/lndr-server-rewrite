import IdentityVerificationRequest from '../dto/identity-verification-request'
import VerificationStatusEntry from '../dto/verification-status-entry'
import VerificationStatusRequest from '../dto/verification-status-request'

import identityRepository from '../repositories/identity.repository'

export default {
  // eslint-disable-next-line complexity, max-statements
  checkStatus: async (statusRequest: VerificationStatusRequest) => {
    const storedStatus = await identityRepository.lookupVerificationStatus(statusRequest.user)

    if (storedStatus && storedStatus.length > 0 && storedStatus[0].status) {
      return new VerificationStatusEntry(storedStatus[0])
    } else if (storedStatus && storedStatus.length > 0 && storedStatus[0].applicant_id) {
      const checkedStatus = await identityRepository.getVerificationStatus(storedStatus.applicant_id)

      if (checkedStatus && checkedStatus.review && checkedStatus.review.reviewAnswer) {
        await identityRepository.addVerificationStatus(checkedStatus.externalUserId, checkedStatus.applicantId, checkedStatus.review.reviewAnswer)

        return new VerificationStatusEntry({
          address: checkedStatus.externalUserId,
          applicantId: checkedStatus.applicantId,
          status: checkedStatus.review.reviewAnswer
        })
      }
      throw new Error('Unable to get applicant status')
    } else {
      throw new Error('Unable to get applicant status')
    }
  },

  handleCallback: (status: any) => identityRepository.addVerificationStatus(status.externalUserId, status.applicantId, status.review.reviewAnswer),

  registerUser: async (verificationRequest: IdentityVerificationRequest) => {
    const { idDocs } = verificationRequest

    if (!idDocs) {
      throw new Error('No idDocs attached')
    }

    const verificationResult = await identityRepository.sendVerificationRequest(verificationRequest)

    return Promise.all(idDocs.map((document) => identityRepository.sendVerificationDocument(verificationResult.id, document)))
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
