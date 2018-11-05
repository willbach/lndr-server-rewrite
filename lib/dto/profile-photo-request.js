"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var credit_protocol_util_1 = require("../utils/credit.protocol.util");
var ethUtil = require('ethereumjs-util');
var ProfilePhotoRequest = /** @class */ (function () {
    function ProfilePhotoRequest(data) {
        this.image = data.image;
        this.signature = data.signature;
    }
    ProfilePhotoRequest.prototype.getAddress = function () {
        var hashBuffer = ethUtil.sha3(this.image);
        return credit_protocol_util_1.signatureToAddress(hashBuffer.toString('hex'), this.signature, false);
    };
    return ProfilePhotoRequest;
}());
exports.default = ProfilePhotoRequest;
//# sourceMappingURL=profile-photo-request.js.map