"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_data_1 = require("form-data");
var identity_verification_request_1 = require("../dto/identity-verification-request");
var config_service_1 = require("../services/config.service");
var db_1 = require("../db");
var request_promise_1 = require("request-promise");
exports.default = {
    addVerificationStatus: function (address, id, status) { return db_1.default.any('INSERT INTO identity_verification (address, applicant_id, status) VALUES ($1,$2,$3) ON CONFLICT (address) DO UPDATE SET status = EXCLUDED.status', [address, id, status]); },
    getVerificationStatus: function (sumsubId) {
        var options = {
            json: true,
            uri: config_service_1.default.sumsubApiUrl + "/resources/applicants/" + sumsubId + "/status/testCompleted?key=" + config_service_1.default.sumsubApiKey
        };
        return request_promise_1.default(options);
    },
    lookupVerificationStatus: function (address) { return db_1.default.any('SELECT address, applicant_id, status FROM identity_verification WHERE address = $1', [address]); },
    removeVerificationStatus: function (address) { return db_1.default.any('DELETE FROM identity_verification WHERE address = $1', [address]); },
    sendVerificationDocument: function (sumsubId, idenDoc) {
        var doc = new form_data_1.default();
        doc.append('metadata', "{\"idDocType\":\"" + idenDoc.idDocType + "\",\"country\":\"" + idenDoc.country + "\"}");
        doc.append('content', idenDoc.file);
        var options = {
            body: doc,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            method: 'POST',
            uri: config_service_1.default.sumsubApiUrl + "/resources/applicants/" + sumsubId + "/info/idDoc?key=" + config_service_1.default.sumsubApiKey
        };
        return request_promise_1.default(options);
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
    sendVerificationRequest: function (verificationRequest) {
        var cleanVerificationObject = new identity_verification_request_1.default(verificationRequest);
        cleanVerificationObject.idDocs = undefined;
        cleanVerificationObject.identitySignature = undefined;
        var options = {
            body: verificationRequest,
            json: true,
            method: 'POST',
            uri: config_service_1.default.sumsubApiUrl + "/resources/applicants?key=" + config_service_1.default.sumsubApiKey
        };
        return request_promise_1.default(options);
    }
};
//# sourceMappingURL=identity.repository.js.map