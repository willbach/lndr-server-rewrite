"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line no-unused-vars
var issue_credit_log_1 = require("../dto/issue-credit-log");
var bilateral_credit_record_1 = require("../dto/bilateral-credit-record");
var db_1 = require("../db");
exports.default = {
    allCredits: function () { return db_1.default.any('SELECT ucac, creditor, debtor, amount, nonce, memo FROM verified_credits'); },
    deleteExpiredSettlementsAndAssociatedCredits: function () { return __awaiter(_this, void 0, void 0, function () {
        var hashes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.any('SELECT hash FROM settlements WHERE created_at < now() - interval \'2 days\' AND verified = FALSE').catch(function (err) { return console.error(err); })];
                case 1:
                    hashes = _a.sent();
                    if (hashes.length === 0) {
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, Promise.all([
                            db_1.default.any('DELETE FROM verified_credits WHERE hash IN ($1:csv)', [hashes]),
                            db_1.default.any('DELETE FROM pending_credits WHERE hash IN ($1:csv)', [hashes]),
                            db_1.default.any('DELETE FROM settlements WHERE hash IN ($1:csv)', [hashes])
                        ]).catch(function (err) { return console.error(err); })];
            }
        });
    }); },
    getBalance: function (address, ucac) {
        var query = 'SELECT ( SELECT COALESCE(SUM(verified_credits.amount), 0) FROM verified_credits LEFT JOIN settlements USING(hash) WHERE creditor = $1 AND ucac = $2 AND verified IS DISTINCT FROM FALSE ) - ( SELECT COALESCE(SUM(verified_credits.amount), 0) FROM verified_credits LEFT JOIN settlements USING (hash) WHERE debtor = $1 AND ucac = $2 AND verified IS DISTINCT FROM FALSE )';
        return db_1.default.any(query, [address, ucac]).then(function (result) { return Number(result[0]['?column?']); });
    },
    getCounterParties: function (address) { return db_1.default.any('SELECT creditor FROM verified_credits WHERE debtor = $1 UNION SELECT debtor FROM verified_credits WHERE creditor = $1', [address])
        .then(function (results) { return results.map(function (val) { return Object.values(val)[0]; }); }); },
    getNonce: function (address, counterparty) { return db_1.default.any('SELECT COALESCE(MAX(nonce) + 1, 0) FROM verified_credits WHERE (creditor = $1 AND debtor = $2) OR (creditor = $2 AND debtor = $1)', [address, counterparty]).then(function (data) { return Number(data[0].coalesce); }); },
    getTwoPartyBalance: function (address, counterparty, ucac) {
        var query = 'SELECT ( SELECT COALESCE(SUM(verified_credits.amount), 0) FROM verified_credits LEFT JOIN settlements USING(hash) WHERE creditor = $1 AND debtor = $2 AND ucac = $3 AND verified IS DISTINCT FROM FALSE) - (SELECT COALESCE(SUM(verified_credits.amount), 0) FROM verified_credits LEFT JOIN settlements USING(hash) WHERE creditor = $2 AND debtor = $1 AND ucac = $3 AND verified IS DISTINCT FROM FALSE)';
        return db_1.default.any(query, [address, counterparty, ucac]).then(function (result) { return Number(result[0]['?column?']); });
    },
    insertCredit: function (record) {
        var creditorSignature = record.creditorSignature, debtorSignature = record.debtorSignature;
        var _a = record.creditRecord, creditor = _a.creditor, debtor = _a.debtor, amount = _a.amount, memo = _a.memo, nonce = _a.nonce, hash = _a.hash, ucac = _a.ucac, submitter = _a.submitter;
        return db_1.default.any('INSERT INTO verified_credits (creditor, debtor, amount, memo, nonce, hash, creditor_signature, debtor_signature, ucac, submitter) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [creditor, debtor, amount, memo, nonce, hash, creditorSignature, debtorSignature, ucac, submitter]);
    },
    insertCredits: function (logs) { return Promise.all(logs.map(function (log) {
        var ucac = log.ucac, creditor = log.creditor, debtor = log.debtor, amount = log.amount, memo = log.memo, nonce = log.nonce;
        var hash = issue_credit_log_1.hashCreditLog(log);
        return db_1.default.any('INSERT INTO verified_credits (creditor, debtor, amount, memo, nonce, hash, creditor_signature, debtor_signature, ucac, submitter) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (hash) DO NOTHING', [creditor, debtor, amount, memo, nonce, hash, '', '', ucac, creditor]);
    })); },
    lookupCreditByAddress: function (address) { return db_1.default.any('SELECT ucac, creditor, debtor, verified_credits.amount, nonce, memo FROM verified_credits LEFT JOIN settlements USING(hash) WHERE (creditor = $1 OR debtor = $1) AND (settlements.hash IS NULL OR settlements.verified = TRUE) ORDER BY verified_credits.created_at DESC', [address]); },
    lookupCreditByHash: function (hash) { return db_1.default.any('SELECT creditor, debtor, verified_credits.amount, memo, submitter, nonce, verified_credits.hash, ucac, creditor_signature, debtor_signature, settlements.amount as settlement_amount, settlements.currency, settlements.blocknumber, settlements.tx_hash FROM verified_credits JOIN settlements USING(hash) WHERE verified_credits.hash = $1', [hash]).then(function (result) {
        if (result.length === 0) {
            return null;
        }
        return result[0];
    }); },
    lookupCreditsByTxHash: function (txHash) { return db_1.default.any('SELECT creditor, debtor, verified_credits.amount, memo, submitter, nonce, verified_credits.hash, ucac, creditor_signature, debtor_signature, settlements.amount as settlement_amount, settlements.currency, settlements.blocknumber, settlements.tx_hash FROM settlements JOIN verified_credits USING(hash) WHERE settlements.tx_hash = $1', [txHash])
        .then(function (credits) { return credits.map(function (credit) { return new bilateral_credit_record_1.default(credit); }); }); },
    lookupSettlementCreditByAddress: function (address) { return db_1.default.any('SELECT creditor, debtor, verified_credits.amount, memo, submitter, nonce, verified_credits.hash, ucac, creditor_signature, debtor_signature, settlements.amount as settlement_amount, settlements.currency, settlements.blocknumber, settlements.tx_hash FROM verified_credits JOIN settlements USING(hash) WHERE (creditor = $1 OR debtor = $1) AND verified = FALSE', [address]); },
    txHashByCreditHash: function (creditHash) { return db_1.default.any('SELECT tx_hash FROM settlements WHERE hash = $1', [creditHash]).then(function (result) {
        if (result.length === 0) {
            return null;
        }
        return result[0].tx_hash;
    }); },
    txHashesToVerify: function () { return db_1.default.any('SELECT tx_hash FROM settlements WHERE tx_hash IS NOT NULL AND verified = FALSE GROUP BY tx_hash')
        .then(function (data) { return data.map(function (tx) { return tx.tx_hash; }); }); },
    updateSettlementTxHash: function (txHash, creditHash) { return db_1.default.any('UPDATE settlements SET tx_hash = $1 WHERE hash = $2', [txHash, creditHash]).catch(function (err) { return console.error(err); }); },
    verifyCreditByHash: function (hash) { return db_1.default.any('UPDATE settlements SET verified = TRUE WHERE hash = $1', [hash]); }
};
//# sourceMappingURL=verified.repository.js.map