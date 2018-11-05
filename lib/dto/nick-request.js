"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_util_1 = require("../utils/buffer.util");
var credit_protocol_util_1 = require("../utils/credit.protocol.util");
var ethUtil = require('ethereumjs-util');
var NickRequest = /** @class */ (function () {
    function NickRequest(data) {
        this.addr = data.addr;
        this.nick = data.nick;
        this.signature = data.signature;
    }
    NickRequest.prototype.signatureMatches = function () {
        var hashBuffer = Buffer.concat([
            buffer_util_1.hexToBuffer(this.addr),
            buffer_util_1.utf8ToBuffer(this.nick)
        ]);
        var hash = buffer_util_1.bufferToHex(ethUtil.sha3(hashBuffer));
        return credit_protocol_util_1.signatureToAddress(hash, this.signature, false) === this.addr;
    };
    return NickRequest;
}());
exports.default = NickRequest;
//# sourceMappingURL=nick-request.js.map