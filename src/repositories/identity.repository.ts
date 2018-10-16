import db from 'src/db'

import IdentityVerificationRequest from 'dto/identity-verification-request'
import IdentityDocument from 'dto/identity-document'

export default {
    addVerificationStatus: (address: string, id: string, status: string) => {
        return db.any("INSERT INTO identity_verification (address, applicant_id, status) VALUES ($1,$2,$3) ON CONFLICT (address) DO UPDATE SET status = EXCLUDED.status", address, id, status)
    },

    removeVerificationStatus: (address: string) => {
        return db.any("DELETE FROM identity_verification WHERE address = $1", address)
    },

    lookupVerificationStatus: (address: string) => {
        return db.any("SELECT address, applicant_id, status FROM identity_verification WHERE address = $1", address)
    },

    sendVerificationRequest: (request: IdentityVerificationRequest) => {
        // :: ServerConfig -> IdentityVerificationRequest -> IO IdentityVerificationResponse
        // sendVerificationRequest config reqInfo@(IdentityVerificationRequest _ _ _ _ _ idDocs) = do
        //     let newReqInfo = reqInfo { idDocs = Nothing }
        //     initReq <- HTTP.parseRequest $ (sumsubApiUrl config) ++ "/resources/applicants?key=" ++ (sumsubApiKey config)
        //     let req = HTTP.addRequestHeader HTTP.hAccept acceptContent $
        //                     HTTP.setRequestBodyJSON newReqInfo $ HTTP.setRequestMethod "POST" initReq
        //     HTTP.getResponseBody <$> HTTP.httpJSON req
        //     where acceptContent = "application/json"
    },

    sendVerificationDocument: (sumsubId: string, idenDoc: IdentityDocument) => {
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
        // :: ServerConfig -> Text -> IO IdentityVerificationStatus
        // getVerificationStatus config id = do
        //     req <- HTTP.parseRequest $ (sumsubApiUrl config) ++ "/resources/applicants/" ++ T.unpack id ++ "/status/testCompleted?key=" ++ (sumsubApiKey config)
        //     res <- HTTP.getResponseBody <$> HTTP.httpJSON req :: IO IdentityVerificationStatus
        //     return res
    }
}
