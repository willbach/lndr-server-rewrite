"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var credit_record_1 = require("./credit-record");
var BilateralCreditRecord = /** @class */ (function () {
    function BilateralCreditRecord(data) {
        if (data.creditRecord instanceof credit_record_1.default) {
            this.creditRecord = data.creditRecord;
        }
        else {
            this.creditRecord = new credit_record_1.default({
                amount: data.amount,
                creditor: data.creditor,
                debtor: data.debtor,
                hash: data.hash,
                memo: data.memo,
                nonce: data.nonce,
                settlementAmount: data.settlement_amount ? data.settlement_amount : data.settlementAmount,
                settlementBlocknumber: data.blocknumber,
                settlementCurrency: data.currency,
                signature: data.creditor_signature,
                submitter: data.submitter,
                ucac: data.ucac
            });
        }
        this.creditorSignature = data.creditorSignature ? data.creditorSignature : data.creditor_signature;
        this.debtorSignature = data.debtorSignature ? data.debtorSignature : data.debtor_signature;
        this.txHash = data.tx_hash;
    }
    return BilateralCreditRecord;
}());
exports.default = BilateralCreditRecord;
//# sourceMappingURL=bilateral-credit-record.js.map