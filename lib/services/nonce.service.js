"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var verified_repository_1 = require("../repositories/verified.repository");
exports.default = {
    getNonce: function (address, counterparty) { return verified_repository_1.default.getNonce(address, counterparty); }
};
//# sourceMappingURL=nonce.service.js.map