"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IssueCreditLog = /** @class */ (function () {
    function IssueCreditLog(data) {
        this.ucac = data.ucac;
        this.creditor = data.creditor;
        this.debtor = data.debtor;
        this.nonce = data.nonce;
        this.memo = data.memo;
        this.amount = data.amount;
    }
    return IssueCreditLog;
}());
exports.default = IssueCreditLog;
exports.hashCreditLog = function (log) {
    var ucac = log.ucac, creditor = log.creditor, debtor = log.debtor, amount = log.amount, memo = log.memo, nonce = log.nonce;
    var buffer = Buffer.concat([
        Buffer.from(ucac, 'hex'),
        Buffer.from(creditor, 'hex'),
        Buffer.from(debtor, 'hex'),
        Buffer.from(amount.toString()),
        Buffer.from(memo),
        Buffer.from(nonce.toString())
    ]);
    return buffer.toString('hex');
};
//# sourceMappingURL=issue-credit-log.js.map