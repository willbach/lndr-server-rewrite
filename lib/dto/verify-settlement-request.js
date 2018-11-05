"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_util_1 = require("../utils/buffer.util");
var credit_protocol_util_1 = require("../utils/credit.protocol.util");
var ethUtil = require('ethereumjs-util');
var VerifySettlementRequest = /** @class */ (function () {
    function VerifySettlementRequest(data) {
        this.creditHash = data.creditHash;
        this.txHash = data.txHash;
        this.creditorAddress = data.creditorAddress;
        this.signature = data.signature;
    }
    VerifySettlementRequest.prototype.signatureMatches = function () {
        var hashBuffer = Buffer.concat([
            buffer_util_1.hexToBuffer(this.creditHash),
            buffer_util_1.hexToBuffer(this.txHash),
            buffer_util_1.hexToBuffer(this.creditorAddress)
        ]);
        var hexHash = buffer_util_1.bufferToHex(ethUtil.sha3(hashBuffer));
        return credit_protocol_util_1.signatureToAddress(hexHash, this.signature, false) === this.creditorAddress;
    };
    return VerifySettlementRequest;
}());
exports.default = VerifySettlementRequest;
//# sourceMappingURL=verify-settlement-request.js.map