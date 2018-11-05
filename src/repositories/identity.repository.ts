import FormData from 'form-data'
import IdentityDocument from '../dto/identity-document'
import IdentityVerificationRequest from '../dto/identity-verification-request'

import configService from '../services/config.service'
import db from '../db'
import request from 'request-promise'

export default {
  addVerificationStatus: (address: string, id: string, status: string) => db.any('INSERT INTO identity_verification (address, applicant_id, status) VALUES ($1,$2,$3) ON CONFLICT (address) DO UPDATE SET status = EXCLUDED.status', [address, id, status]),

  getVerificationStatus: (sumsubId: string) => {
    const options = {
      json: true,
      uri: `${configService.sumsubApiUrl}/resources/applicants/${sumsubId}/status/testCompleted?key=${configService.sumsubApiKey}`
    }

    return request(options)
  },

  lookupVerificationStatus: (address: string) => db.any('SELECT address, applicant_id, status FROM identity_verification WHERE address = $1', [address]),

  removeVerificationStatus: (address: string) => db.any('DELETE FROM identity_verification WHERE address = $1', [address]),

  sendVerificationDocument: (sumsubId: string, idenDoc: IdentityDocument) => {
    const doc = new FormData()
    doc.append('metadata', `{"idDocType":"${idenDoc.idDocType}","country":"${idenDoc.country}"}`)
    doc.append('content', idenDoc.file)

    const options = {
      body: doc,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: 'POST',
      uri: `${configService.sumsubApiUrl}/resources/applicants/${sumsubId}/info/idDoc?key=${configService.sumsubApiKey}`
    }

    return request(options)
    // :: LoggerSet -> ServerConfig -> Text -> IdentityDocument -> IO IdentityDocument
    // SendVerificationDocument loggerSet config sumsubId idenDoc@(IdentityDocument idDocType country (Just file)) = do
    //     Let content = B64.decodeLenient $ TE.encodeUtf8 file
    //         Metadata = (VerificationMetaData idDocType country)

    //     -- pushLogStrLn loggerSet . toLogStr $ metadata

    //     InitReq <- HTTP.parseRequest $ (sumsubApiUrl config) ++ "/resources/applicants/" ++ T.unpack sumsubId ++ "/info/idDoc?key=" ++ (sumsubApiKey config)
    //     BodyReq <- LM.formDataBody [ LM.partLBS "metadata" $ A.encode $ A.toJSON metadata
    //         , LM.partFileRequestBody "content" "image.jpg" $ HTTP.RequestBodyBS content ] initReq
    //     HTTP.getResponseBody <$> HTTP.httpJSON bodyReq
  },

  sendVerificationRequest: (verificationRequest: IdentityVerificationRequest) => {
    const cleanVerificationObject = new IdentityVerificationRequest(verificationRequest)
    cleanVerificationObject.idDocs = undefined
    cleanVerificationObject.identitySignature = undefined

    const options = {
      body: verificationRequest,
      json: true,
      method: 'POST',
      uri: `${configService.sumsubApiUrl}/resources/applicants?key=${configService.sumsubApiKey}`
    }

    return request(options)
  }
}
