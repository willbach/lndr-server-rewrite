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
var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
var fs = require('fs');
var path = require('path');
var serverConfig = require('../services/config.service');
var credit_protocol_util_1 = require("../utils/credit.protocol.util");
var issue_credit_log_1 = require("../dto/issue-credit-log");
var buffer_util_1 = require("../utils/buffer.util");
// Const web3 = new Web3(new Web3.providers.HttpProvider(serverConfig.web3Url))
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
var rawAbi = fs.readFileSync(path.join(__dirname, '../../data/CreditProtocol.abi.json'), { encoding: 'utf8' });
var cpAbi = JSON.parse(rawAbi);
var ethInterfaceRepo = {
    currentBlockNumber: function () { return new Promise(function (resolve, reject) { return web3.eth.getBlockNumber(function (err, data) {
        err ? reject(err) : resolve(data);
    }); }); },
    currentExecutionNonce: function () { return new Promise(function (resolve, reject) { return web3.eth.getTransactionCount(serverConfig.default.executionAddress, function (err, data) {
        err ? reject(err) : resolve(data);
    }); }); },
    // eslint-disable-next-line max-statements
    finalizeTransaction: function (record) { return __awaiter(_this, void 0, void 0, function () {
        var creditRecord, creditorSignature, debtorSignature, creditor, debtor, amount, memo, ucac, execNonce, privateKeyBuffer, CreditProtocolContract, contractInstance, bytes32Memo, cSig, dSig, callData, rawTx, tx, serializedTx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    creditRecord = record.creditRecord, creditorSignature = record.creditorSignature, debtorSignature = record.debtorSignature;
                    creditor = creditRecord.creditor, debtor = creditRecord.debtor, amount = creditRecord.amount, memo = creditRecord.memo, ucac = creditRecord.ucac;
                    return [4 /*yield*/, new Promise(function (resolve, reject) { return web3.eth.getTransactionCount("0x" + serverConfig.default.executionAddress, function (err, data) {
                            err ? reject(err) : resolve(data);
                        }); })];
                case 1:
                    execNonce = _a.sent();
                    privateKeyBuffer = Buffer.from(serverConfig.default.executionPrivateKey.slice(2), 'hex');
                    CreditProtocolContract = web3.eth.contract(cpAbi);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            CreditProtocolContract.at(serverConfig.default.creditProtocolAddress, function (err, data) {
                                err ? reject(err) : resolve(data);
                            });
                        })];
                case 2:
                    contractInstance = _a.sent();
                    bytes32Memo = web3.fromAscii(memo);
                    cSig = credit_protocol_util_1.decomposeSignatureToBytes32(creditorSignature);
                    dSig = credit_protocol_util_1.decomposeSignatureToBytes32(debtorSignature);
                    callData = contractInstance.issueCredit.getData("0x" + ucac, "0x" + creditor, "0x" + debtor, credit_protocol_util_1.bignumToHexString(amount), [cSig.r, cSig.s, cSig.v], [dSig.r, dSig.s, dSig.v], bytes32Memo);
                    rawTx = {
                        chainId: 1,
                        data: callData,
                        from: "0x" + serverConfig.default.executionAddress,
                        gasLimit: serverConfig.default.maxGas,
                        gasPrice: serverConfig.default.gasPrice,
                        nonce: execNonce,
                        to: serverConfig.default.creditProtocolAddress,
                        value: '0x00'
                    };
                    tx = new Tx(rawTx);
                    tx.sign(privateKeyBuffer);
                    serializedTx = tx.serialize();
                    // Const nonceResult = await new Promise((resolve, reject) => {
                    //     ContractInstance.getNonce(`0x${creditor}`, `0x${debtor}`, (err, data) => {
                    //         If(err) reject(err)
                    //         Else resolve(data)
                    //     })
                    // })
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            web3.eth.sendRawTransaction("0x" + serializedTx.toString('hex'), function (err, data) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(data);
                                }
                            });
                        })];
            }
        });
    }); },
    handleLog: function (log) {
        console.error('This was only used on the CLI ', log);
    },
    lndrLogs: function () {
        var issueCreditSubscription = web3.eth.subscribe('logs', {
            address: serverConfig.default.creditProtocolAddress,
            fromBlock: serverConfig.default.scanStartBlock,
            topics: [serverConfig.default.issueCreditEvent]
        });
        issueCreditSubscription.on('data', function (log) {
            if (log.topics.length >= 3) {
                var _a = log.topics, ucac = _a[0], creditor = _a[1], debtor = _a[2], logStart = 122;
                var dataString = log.data.slice(logStart);
                var amount = parseInt(dataString.slice(0, 2), 16);
                var nonce = parseInt(dataString.slice(2, 4), 16);
                var memo = Buffer.from(dataString.slice(4), 'hex').toString('utf8');
                var creditLog = new issue_credit_log_1.default({
                    amount: amount,
                    creditor: creditor.slice(2),
                    debtor: debtor.slice(2),
                    memo: memo,
                    nonce: nonce,
                    ucac: ucac.slice(2)
                });
                ethInterfaceRepo.handleLog(creditLog);
            }
        });
        var issueCreditErrorSubscription = web3.eth.subscribe('logs', {
            address: '0x60ef3386514cc5a63a0be3beb3e447f614b09c68697f392e9a5b907f5dbd48b9',
            fromBlock: serverConfig.default.scanStartBlock,
            topics: [serverConfig.default.issueCreditEvent]
        });
        issueCreditErrorSubscription.on('data', console.error);
    },
    // eslint-disable-next-line max-statements, complexity, max-params
    verifySettlementPayment: function (txHash, creditor, debtor, amount, settlementCurrency) { return __awaiter(_this, void 0, void 0, function () {
        var tx, creditorMatch, debtorMatch, valueMatch, txValue, txValueIndex, debtorStart, debtorEnd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) { return web3.eth.getTransaction("0x" + txHash, function (err, data) {
                        err ? reject(err) : resolve(data);
                    }); })];
                case 1:
                    tx = _a.sent();
                    if (!tx || !tx.value) {
                        throw new Error("transaction not found, tx_hash: " + txHash);
                    }
                    creditorMatch = creditor === buffer_util_1.stripHexPrefix(tx.from);
                    debtorMatch = false, valueMatch = false, txValue = 0;
                    if (settlementCurrency === 'DAI') {
                        txValueIndex = 114, debtorStart = 34, debtorEnd = 74;
                        txValue = parseInt(tx.input.slice(txValueIndex), 16);
                        debtorMatch = debtor === tx.input.slice(debtorStart, debtorEnd);
                        valueMatch = txValue === amount;
                    }
                    else {
                        txValue = tx.value.toNumber();
                        debtorMatch = debtor === buffer_util_1.stripHexPrefix(tx.to);
                        valueMatch = amount === txValue;
                    }
                    if (!creditorMatch) {
                        throw new Error("Bad from match, hash: " + txHash + " tx value: " + txValue + " settlement value: " + amount);
                    }
                    else if (!debtorMatch) {
                        throw new Error("Bad to match, hash: " + txHash + " tx value: " + txValue + " settlement value: " + amount);
                    }
                    else if (!valueMatch) {
                        throw new Error("Bad value match, hash: " + txHash + " tx value: " + txValue + " settlement value: " + amount);
                    }
                    return [2 /*return*/, true];
            }
        });
    }); }
};
exports.default = ethInterfaceRepo;
//# sourceMappingURL=ethereum.interface.repository.js.map