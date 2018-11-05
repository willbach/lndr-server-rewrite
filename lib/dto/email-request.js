"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_util_1 = require("../utils/buffer.util");
var credit_protocol_util_1 = require("../utils/credit.protocol.util");
var ethUtil = require('ethereumjs-util');
var EmailRequest = /** @class */ (function () {
    function EmailRequest(data) {
        this.addr = data.addr;
        this.email = data.email;
        this.signature = data.signature;
    }
    EmailRequest.prototype.signatureMatches = function () {
        var hashBuffer = Buffer.concat([
            buffer_util_1.hexToBuffer(this.addr),
            buffer_util_1.utf8ToBuffer(this.email)
        ]);
        var hash = buffer_util_1.bufferToHex(ethUtil.sha3(hashBuffer));
        return credit_protocol_util_1.signatureToAddress(hash, this.signature, false) === this.addr;
    };
    return EmailRequest;
}());
exports.default = EmailRequest;
//# sourceMappingURL=email-request.js.map