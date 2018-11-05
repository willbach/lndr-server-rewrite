"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_util_1 = require("../utils/buffer.util");
var credit_protocol_util_1 = require("../utils/credit.protocol.util");
var ethUtil = require('ethereumjs-util');
var PushRequest = /** @class */ (function () {
    function PushRequest(data) {
        this.channelID = data.channelID;
        this.platform = data.platform;
        this.address = data.address;
        this.signature = data.signature;
    }
    PushRequest.prototype.signatureMatches = function () {
        var hashBuffer = Buffer.concat([
            buffer_util_1.utf8ToBuffer(this.platform),
            buffer_util_1.utf8ToBuffer(this.channelID),
            buffer_util_1.hexToBuffer(this.address)
        ]);
        var hexHash = buffer_util_1.bufferToHex(ethUtil.sha3(hashBuffer));
        return credit_protocol_util_1.signatureToAddress(hexHash, this.signature, false) === this.address;
    };
    return PushRequest;
}());
exports.default = PushRequest;
//# sourceMappingURL=push-request.js.map