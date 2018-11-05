"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_util_1 = require("../utils/buffer.util");
var credit_protocol_util_1 = require("../utils/credit.protocol.util");
var ethUtil = require('ethereumjs-util');
var PayPalRequest = /** @class */ (function () {
    function PayPalRequest(data) {
        this.friend = data.friend;
        this.requestor = data.requestor;
        this.paypalRequestSignature = data.paypalRequestSignature;
    }
    PayPalRequest.prototype.signatureMatches = function () {
        var hashBuffer = Buffer.concat([
            buffer_util_1.hexToBuffer(this.friend),
            buffer_util_1.hexToBuffer(this.requestor)
        ]);
        var hexHash = buffer_util_1.bufferToHex(ethUtil.sha3(hashBuffer));
        return credit_protocol_util_1.signatureToAddress(hexHash, this.paypalRequestSignature, false) === this.requestor;
    };
    return PayPalRequest;
}());
exports.default = PayPalRequest;
//# sourceMappingURL=paypal-request.js.map