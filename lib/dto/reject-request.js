"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var credit_protocol_util_1 = require("../utils/credit.protocol.util");
var RejectRequest = /** @class */ (function () {
    function RejectRequest(data) {
        this.hash = data.hash;
        this.signature = data.signature;
    }
    RejectRequest.prototype.getAddress = function () {
        return credit_protocol_util_1.signatureToAddress(this.hash, this.signature, false);
    };
    return RejectRequest;
}());
exports.default = RejectRequest;
//# sourceMappingURL=reject-request.js.map