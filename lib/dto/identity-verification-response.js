"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var identity_verification_info_1 = require("../dto/identity-verification-info");
var required_identity_documents_1 = require("../dto/required-identity-documents");
var IdentityVerificationResponse = /** @class */ (function () {
    function IdentityVerificationResponse(data) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.inspectionId = data.inspectionId;
        this.clientId = data.clientId;
        this.jobId = data.jobId;
        this.externalUserId = data.externalUserId;
        this.info = new identity_verification_info_1.default(data.info);
        this.email = data.email;
        this.env = data.env;
        this.requiredIdDocs = new required_identity_documents_1.default(data.requiredIdDocs);
    }
    return IdentityVerificationResponse;
}());
exports.default = IdentityVerificationResponse;
//# sourceMappingURL=identity-verification-response.js.map