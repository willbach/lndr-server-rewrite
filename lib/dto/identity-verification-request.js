"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_util_1 = require("../utils/buffer.util");
var required_identity_documents_1 = require("../dto/required-identity-documents");
var credit_protocol_util_1 = require("../utils/credit.protocol.util");
var ethUtil = require('ethereumjs-util');
var IdentityVerificationRequest = /** @class */ (function () {
    function IdentityVerificationRequest(data) {
        this.email = data.email;
        this.externalUserId = data.externalUserId;
        this.info = data.info;
        this.requiredIdDocs = new required_identity_documents_1.default(data.requiredIdDocs);
        this.identitySignature = data.identitySignature;
        this.idDocs = data.idDocs;
    }
    IdentityVerificationRequest.prototype.signatureMatches = function () {
        var hashBuffer = Buffer.concat([
            buffer_util_1.hexToBuffer(this.externalUserId)
        ]);
        var hexHash = buffer_util_1.bufferToHex(ethUtil.sha3(hashBuffer));
        if (!this.identitySignature) {
            return false;
        }
        return credit_protocol_util_1.signatureToAddress(hexHash, this.identitySignature, false) === this.externalUserId;
    };
    return IdentityVerificationRequest;
}());
exports.default = IdentityVerificationRequest;
//# sourceMappingURL=identity-verification-request.js.map