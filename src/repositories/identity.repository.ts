import db from 'src/db'
import request from 'request-promise'
import configService from 'services/config.service'

import FormData from 'form-data'
import IdentityVerificationRequest from 'dto/identity-verification-request'
import IdentityDocument from 'dto/identity-document'

export default {
    addVerificationStatus: (address: string, id: string, status: string) => {
        return db.any("INSERT INTO identity_verification (address, applicant_id, status) VALUES ($1,$2,$3) ON CONFLICT (address) DO UPDATE SET status = EXCLUDED.status", [address, id, status])
    },

    removeVerificationStatus: (address: string) => {
        return db.any("DELETE FROM identity_verification WHERE address = $1", [address])
    },

    lookupVerificationStatus: (address: string) => {
        return db.any("SELECT address, applicant_id, status FROM identity_verification WHERE address = $1", [address])
    },

    sendVerificationRequest: (verificationRequest: IdentityVerificationRequest) => {
        const cleanVerificationObject = new IdentityVerificationRequest(verificationRequest)
        cleanVerificationObject.idDocs = undefined
        cleanVerificationObject.identitySignature = undefined

        const options = {
            method: 'POST',
            uri: `${configService.sumsubApiUrl}/resources/applicants?key=${configService.sumsubApiKey}`,
            body: verificationRequest,
            json: true // Automatically stringifies the body to JSON
        }
        
        return request(options)
    },

    sendVerificationDocument: (sumsubId: string, idenDoc: IdentityDocument) => {
        const doc = new FormData()
        doc.append('metadata', `{"idDocType":"${idenDoc.idDocType}","country":"${idenDoc.country}"}`)
        doc.append('content', idenDoc.file)

        const options = {
            method: 'POST',
            uri: `${configService.sumsubApiUrl}/resources/applicants/${sumsubId}/info/idDoc?key=${configService.sumsubApiKey}`,
            body: doc,
            headers: {
                "Content-Type": 'multipart/form-data'
            }
        }
        
        return request(options)
        // :: LoggerSet -> ServerConfig -> Text -> IdentityDocument -> IO IdentityDocument
        // sendVerificationDocument loggerSet config sumsubId idenDoc@(IdentityDocument idDocType country (Just file)) = do
        //     let content = B64.decodeLenient $ TE.encodeUtf8 file
        //         metadata = (VerificationMetaData idDocType country)
          
        //     -- pushLogStrLn loggerSet . toLogStr $ metadata
        
        //     initReq <- HTTP.parseRequest $ (sumsubApiUrl config) ++ "/resources/applicants/" ++ T.unpack sumsubId ++ "/info/idDoc?key=" ++ (sumsubApiKey config)
        //     bodyReq <- LM.formDataBody [ LM.partLBS "metadata" $ A.encode $ A.toJSON metadata
        //         , LM.partFileRequestBody "content" "image.jpg" $ HTTP.RequestBodyBS content ] initReq
        //     HTTP.getResponseBody <$> HTTP.httpJSON bodyReq
    },

    getVerificationStatus: (sumsubId: string) => {
        const options = {
            uri: `${configService.sumsubApiUrl}/resources/applicants/${sumsubId}/status/testCompleted?key=${configService.sumsubApiKey}`,
            json: true // Automatically parses the JSON string in the response
        }

        return request(options)
    }
}
