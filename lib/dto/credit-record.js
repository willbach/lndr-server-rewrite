"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_util_1 = require("../utils/buffer.util");
var credit_protocol_util_1 = require("../utils/credit.protocol.util");
var ethUtil = require('ethereumjs-util');
var CreditRecord = /** @class */ (function () {
    // eslint-disable-next-line max-statements
    function CreditRecord(data, type) {
        this.creditor = this.strip0x(data.creditor);
        this.debtor = this.strip0x(data.debtor);
        this.submitter = this.strip0x(data.submitter);
        this.ucac = this.strip0x(data.ucac);
        this.memo = data.memo;
        this.nonce = data.nonce;
        this.signature = data.signature;
        this.amount = Number(data.amount);
        this.hash = data.hash;
        this.settlementBlocknumber = Number(type === 'settlement' ? data.blocknumber : data.settlementBlocknumber);
        this.settlementAmount = Number(type === 'settlement' ? data.settlement_amount : data.settlementAmount);
        this.settlementCurrency = type === 'settlement' ? data.currency : data.settlementCurrency;
    }
    // eslint-disable-next-line class-methods-use-this
    CreditRecord.prototype.strip0x = function (address) {
        if (address.substr(0, 2) === '0x') {
            return address.slice(2);
        }
        return address;
    };
    CreditRecord.prototype.signatureMatches = function () {
        return credit_protocol_util_1.signatureToAddress(this.hash, this.signature) === this.submitter;
    };
    CreditRecord.prototype.generateHash = function () {
        var buffer = Buffer.concat([
            buffer_util_1.hexToBuffer(this.ucac),
            buffer_util_1.hexToBuffer(this.creditor),
            buffer_util_1.hexToBuffer(this.debtor),
            buffer_util_1.int32ToBuffer(this.amount),
            buffer_util_1.int32ToBuffer(this.nonce)
        ]);
        return buffer_util_1.bufferToHex(ethUtil.sha3(buffer));
    };
    return CreditRecord;
}());
exports.default = CreditRecord;
//# sourceMappingURL=credit-record.js.map