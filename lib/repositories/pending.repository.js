"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var credit_record_1 = require("../dto/credit-record");
var db_1 = require("../db");
exports.default = {
    deletePayPalRequest: function (friend, requestor) { return db_1.default.any('DELETE FROM paypal_requests WHERE (friend = $1 AND requestor = $2)', [friend, requestor]); },
    deletePending: function (hash, settlement) {
        if (settlement) {
            return db_1.default.any('DELETE FROM settlements WHERE hash = $1', [hash]);
        }
        return db_1.default.any('DELETE FROM pending_credits WHERE hash = $1', [hash]);
    },
    insertPayPalRequest: function (friend, requestor) { return db_1.default.any('INSERT INTO paypal_requests (friend, requestor) VALUES ($1,$2)', [friend, requestor]); },
    insertPending: function (record) {
        var creditor = record.creditor, debtor = record.debtor, amount = record.amount, memo = record.memo, submitter = record.submitter, nonce = record.nonce, hash = record.hash, signature = record.signature, ucac = record.ucac, settlementCurrency = record.settlementCurrency;
        return db_1.default.any('INSERT INTO pending_credits (creditor, debtor, amount, memo, submitter, nonce, hash, signature, ucac, settlement_currency) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [creditor, debtor, amount, memo, submitter, nonce, hash, signature, ucac, settlementCurrency]);
    },
    insertSettlementData: function (record) {
        var hash = record.hash, settlementAmount = record.settlementAmount, settlementCurrency = record.settlementCurrency, settlementBlocknumber = record.settlementBlocknumber;
        return db_1.default.any('INSERT INTO settlements (hash, amount, currency, blocknumber, verified) VALUES ($1,$2,$3,$4,FALSE)', [hash, settlementAmount, settlementCurrency, settlementBlocknumber]);
    },
    lookupPayPalRequestsByAddress: function (address) { return db_1.default.any('SELECT paypal_requests.friend, paypal_requests.requestor, friends.nickname, requestors.nickname FROM paypal_requests LEFT JOIN nicknames requestors ON requestors.address = requestor LEFT JOIN nicknames friends ON friends.address = friend WHERE (friend = $1 OR requestor = $1)', [address]); },
    lookupPending: function (hash) { return db_1.default.any('SELECT creditor, debtor, pending_credits.amount, memo, submitter, nonce, pending_credits.hash, signature, ucac, settlements.currency, settlements.amount as settlement_amount, settlements.blocknumber FROM pending_credits LEFT JOIN settlements USING(hash) WHERE pending_credits.hash = $1', [hash]).then(function (result) {
        if (!result || result.length === 0) {
            return null;
        }
        return new credit_record_1.default(result[0], 'settlement');
    }); },
    lookupPendingByAddress: function (address, settlement) {
        if (settlement) {
            return db_1.default.any('SELECT creditor, debtor, pending_credits.amount, memo, submitter, nonce, pending_credits.hash, signature, ucac, settlements.currency, settlements.amount as settlement_amount, settlements.blocknumber FROM pending_credits JOIN settlements USING(hash) WHERE (creditor = $1 OR debtor = $1)', [address]);
        }
        return db_1.default.any('SELECT creditor, debtor, pending_credits.amount, memo, submitter, nonce, pending_credits.hash, signature, ucac, settlement_currency FROM pending_credits LEFT JOIN settlements USING(hash) WHERE (creditor = $1 OR debtor = $1) AND settlements.hash IS NULL', [address]);
    },
    lookupPendingByAddresses: function (address1, address2) { return db_1.default.any('SELECT creditor, debtor, amount, memo, submitter, nonce, hash, signature, ucac, settlement_currency FROM pending_credits WHERE (creditor = $1 AND debtor = $2) OR (creditor = $2 AND debtor = $1)', [address1, address2]); },
    lookupPendingSettlementByAddresses: function (address1, address2) { return db_1.default.any('SELECT verified_credits.hash FROM verified_credits JOIN settlements USING(hash) WHERE ((creditor = $1 AND debtor = $2) OR (creditor = $2 AND debtor = $1)) AND settlements.verified = FALSE', [address1, address2]); }
};
//# sourceMappingURL=pending.repository.js.map