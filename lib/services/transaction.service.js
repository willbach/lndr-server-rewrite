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
var config_service_1 = require("../services/config.service");
var bilateral_credit_record_1 = require("../dto/bilateral-credit-record");
var credit_record_1 = require("../dto/credit-record");
var issue_credit_log_1 = require("../dto/issue-credit-log");
var ethereum_interface_repository_1 = require("../repositories/ethereum.interface.repository");
var friends_repository_1 = require("../repositories/friends.repository");
var notifications_repository_1 = require("../repositories/notifications.repository");
var pending_repository_1 = require("../repositories/pending.repository");
var verified_repository_1 = require("../repositories/verified.repository");
var decimals18 = Math.pow(10, 18);
var decimals6 = Math.pow(10, 6);
// eslint-disable-next-line complexity, max-statements
var calculateSettlementCreditRecord = function (config, record) {
    var amount = record.amount, ucac = record.ucac, settlementCurrency = record.settlementCurrency;
    var latestBlockNumber = config.latestBlockNumber;
    var noAdjustment = { idr: true, jpy: true, krw: true, vnd: true };
    var currency = Object.keys(config.lndrUcacAddrs).find(function (key) { return config.lndrUcacAddrs[key] === "0x" + ucac; });
    if (currency === undefined) {
        currency = 'usd';
    }
    var priceAdjustmentForCents = noAdjustment[currency] ? 1 : 100;
    if (settlementCurrency === 'ETH' || settlementCurrency === 'DAI') {
        var rawSettlementAmount = null;
        if (settlementCurrency === 'ETH') {
            var currencyPerEth = config.ethereumPrices[currency.toLowerCase()] * priceAdjustmentForCents;
            rawSettlementAmount = amount / currencyPerEth * decimals18;
        }
        else {
            // This code can be copied for any stable coin, assumed to be 1 DAI to 1 USD
            var currencyPerDAI = config.ethereumPrices[currency.toLowerCase()] / config.ethereumPrices.usd;
            rawSettlementAmount = amount / currencyPerDAI * decimals18 / priceAdjustmentForCents;
        }
        record.settlementAmount = rawSettlementAmount - rawSettlementAmount % decimals6;
        record.settlementBlocknumber = latestBlockNumber;
    }
    return record;
};
exports.default = {
    getPendingTransactions: function (address) { return __awaiter(_this, void 0, void 0, function () {
        var rawPending;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pending_repository_1.default.lookupPendingByAddress(address, false)];
                case 1:
                    rawPending = _a.sent();
                    return [2 /*return*/, rawPending.map(function (tx) { return new credit_record_1.default(tx, 'pendingTx'); })];
            }
        });
    }); },
    getTransactions: function (address) { return __awaiter(_this, void 0, void 0, function () {
        var rawTransactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, verified_repository_1.default.lookupCreditByAddress(address)];
                case 1:
                    rawTransactions = _a.sent();
                    return [2 /*return*/, rawTransactions.map(function (tx) { return new issue_credit_log_1.default(tx); })];
            }
        });
    }); },
    // eslint-disable-next-line complexity, max-statements
    reject: function (rejectRequest) { return __awaiter(_this, void 0, void 0, function () {
        var signerAddress, pending, recipientAddress;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signerAddress = rejectRequest.getAddress();
                    return [4 /*yield*/, pending_repository_1.default.lookupPending(rejectRequest.hash)];
                case 1:
                    pending = _a.sent();
                    if (!pending) {
                        throw new Error('Hash does not match any pending record');
                    }
                    if (signerAddress !== pending.creditor && signerAddress !== pending.debtor) {
                        throw new Error('bad rejection sig');
                    }
                    if (!pending.settlementAmount) return [3 /*break*/, 3];
                    return [4 /*yield*/, pending_repository_1.default.deletePending(rejectRequest.hash, true)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    recipientAddress = signerAddress === pending.creditor ? pending.debtor : pending.creditor;
                    notifications_repository_1.default.sendNotification(signerAddress, recipientAddress, 'PendingCreditRejection');
                    return [2 /*return*/, pending_repository_1.default.deletePending(rejectRequest.hash, false)];
            }
        });
    }); },
    // eslint-disable-next-line complexity, max-statements
    submitCredit: function (record, recordNum) { return __awaiter(_this, void 0, void 0, function () {
        var creditor, debtor, memo, submitter, hash, ucac, counterparty, pendingCredit, creditorSignature, debtorSignature, bilateralRecord, web3Result, processedRecord, existingPending, existingPendingSettlement;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    creditor = record.creditor, debtor = record.debtor, memo = record.memo, submitter = record.submitter, hash = record.hash, ucac = record.ucac;
                    if (hash !== record.generateHash()) {
                        throw new Error('Bad hash included with credit record.');
                    }
                    else if (memo.length > 32) {
                        throw new Error('Memo too long. Memos must be no longer than 32 characters.');
                    }
                    else if (submitter !== creditor && submitter !== debtor) {
                        throw new Error('Submitter is not creditor nor debtor.');
                    }
                    else if (creditor === debtor) {
                        throw new Error('Creditor and debtor cannot be equal.');
                    }
                    else if (!Object.values(config_service_1.default.lndrUcacAddrs).includes("0x" + ucac)) {
                        throw new Error('Unrecognized UCAC address.');
                    }
                    counterparty = submitter === creditor ? debtor : creditor;
                    return [4 /*yield*/, pending_repository_1.default.lookupPending(hash)];
                case 1:
                    pendingCredit = _a.sent();
                    if (!pendingCredit) return [3 /*break*/, 8];
                    if (!(pendingCredit.signature === record.signature)) return [3 /*break*/, 2];
                    throw new Error('Signatures should not be the same for creditor and debtor.');
                case 2:
                    creditorSignature = record.submitter === record.creditor ? record.signature : pendingCredit.signature;
                    debtorSignature = record.submitter === record.debtor ? record.signature : pendingCredit.signature;
                    bilateralRecord = new bilateral_credit_record_1.default({ creditRecord: pendingCredit, creditorSignature: creditorSignature, debtorSignature: debtorSignature });
                    if (!!pendingCredit.settlementAmount) return [3 /*break*/, 4];
                    return [4 /*yield*/, ethereum_interface_repository_1.default.finalizeTransaction(bilateralRecord)];
                case 3:
                    web3Result = _a.sent();
                    console.error('WEB3:', web3Result);
                    _a.label = 4;
                case 4: return [4 /*yield*/, verified_repository_1.default.insertCredit(bilateralRecord)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, pending_repository_1.default.deletePending(bilateralRecord.creditRecord.hash, false)];
                case 6:
                    _a.sent();
                    if (recordNum === 0) {
                        notifications_repository_1.default.sendNotification(submitter, counterparty, 'CreditConfirmation');
                    }
                    _a.label = 7;
                case 7: return [3 /*break*/, 17];
                case 8: return [4 /*yield*/, calculateSettlementCreditRecord(config_service_1.default, record)];
                case 9:
                    processedRecord = _a.sent();
                    return [4 /*yield*/, pending_repository_1.default.lookupPendingByAddresses(creditor, debtor)];
                case 10:
                    existingPending = _a.sent();
                    if (recordNum === 0 && existingPending.length > 0) {
                        throw new Error('A pending credit record already exists for the two users.');
                    }
                    return [4 /*yield*/, pending_repository_1.default.lookupPendingSettlementByAddresses(creditor, debtor)];
                case 11:
                    existingPendingSettlement = _a.sent();
                    if (recordNum === 0 && existingPendingSettlement.length > 0) {
                        throw new Error('An unverified settlement credit record already exists for the two users.');
                    }
                    return [4 /*yield*/, friends_repository_1.default.addFriends(creditor, debtor)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, friends_repository_1.default.addFriends(debtor, creditor)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, pending_repository_1.default.insertPending(processedRecord)];
                case 14:
                    _a.sent();
                    if (!processedRecord.settlementAmount) return [3 /*break*/, 16];
                    return [4 /*yield*/, pending_repository_1.default.insertSettlementData(processedRecord)];
                case 15:
                    _a.sent();
                    _a.label = 16;
                case 16:
                    if (recordNum === 0) {
                        notifications_repository_1.default.sendNotification(submitter, counterparty, 'NewPendingCredit');
                    }
                    _a.label = 17;
                case 17: return [2 /*return*/, true];
            }
        });
    }); }
};
//# sourceMappingURL=transaction.service.js.map