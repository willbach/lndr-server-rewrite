"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_util_1 = require("../utils/buffer.util");
var credit_protocol_util_1 = require("../utils/credit.protocol.util");
var ethUtil = require('ethereumjs-util');
var VerificationStatusRequest = /** @class */ (function () {
    function VerificationStatusRequest(data) {
        this.user = data.user;
        this.verificationStatusSignature = data.verificationStatusSignature;
    }
    VerificationStatusRequest.prototype.signatureMatches = function () {
        var hashBuffer = Buffer.concat([
            buffer_util_1.hexToBuffer(this.user)
        ]);
        var hexHash = buffer_util_1.bufferToHex(ethUtil.sha3(hashBuffer));
        return credit_protocol_util_1.signatureToAddress(hexHash, this.verificationStatusSignature, false) === this.user;
    };
    return VerificationStatusRequest;
}());
exports.default = VerificationStatusRequest;
//# sourceMappingURL=verification-status-request.js.map