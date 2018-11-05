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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
var config = fs.readFileSync(path.join(__dirname, '../../data/lndr-server.config.json'), { encoding: 'utf8' });
var configObj = JSON.parse(config);
var config_response_1 = require("../dto/config-response");
var ethereum_interface_repository_1 = require("../repositories/ethereum.interface.repository");
var heartbeat_repository_1 = require("../repositories/heartbeat.repository");
var credit_protocol_util_1 = require("../utils/credit.protocol.util");
var verified_repository_1 = require("../repositories/verified.repository");
var blockNumberStart = 40600;
var ethereumPrices = {
    aud: '250',
    cad: '200',
    chf: '250',
    cny: '1600',
    dkk: '1500',
    eur: '200',
    gbp: '200',
    hkd: '1600',
    idr: '2800000',
    ils: '800',
    inr: '13500',
    jpy: '20000',
    krw: '200000',
    myr: '800',
    nok: '2000',
    nzd: '250',
    pln: '750',
    rub: '13000',
    sek: '2000',
    sgd: '270',
    thb: '6400',
    try: '800',
    usd: '200',
    vnd: '4500000'
};
var ServerConfig = /** @class */ (function () {
    /* eslint-disable max-statements, prefer-destructuring */
    function ServerConfig(data) {
        var ucacs = data['lndr-ucacs'];
        this.lndrUcacAddrs = Object.keys(ucacs).reduce(function (obj, key) {
            obj[key.toUpperCase()] = ucacs[key];
            return obj;
        }, {});
        this.bindAddress = data['bind-address'];
        this.bindPort = data['bind-port'];
        this.creditProtocolAddress = data['credit-protocol-address'];
        this.issueCreditEvent = data['issue-credit-event'];
        this.scanStartBlock = data['scan-start-block'];
        this.dbUser = data.db.user;
        this.dbUserPassword = data.db['user-password'];
        this.dbName = data.db.name;
        this.dbHost = data.db.host;
        this.dbPort = data.db.port;
        this.gasPrice = data['gas-price'];
        this.ethereumPrices = ethereumPrices;
        this.maxGas = data['max-gas'];
        this.latestBlockNumber = 0;
        this.heartbeatInterval = data['heartbeat-interval'];
        this.awsPhotoBucket = data.aws['photo-bucket'];
        this.awsAccessKeyId = data.aws['access-key-id'];
        this.awsSecretAccessKey = data.aws['secret-access-key'];
        this.notificationsApiUrl = data.notifications['api-url'];
        this.notificationsApiKey = data.notifications['api-key'];
        this.sumsubApiUrl = data.sumsub['api-url'];
        this.sumsubApiKey = data.sumsub['api-key'];
        this.sumsubApiCallbackSecret = data.sumsub['api-callback-secret'];
        this.web3Url = data['web3-url'];
        this.executionAddress = credit_protocol_util_1.privateToAddress(data['execution-private-key']);
        this.executionNonce = 0;
        if (data['execution-private-key'].slice(0, 2) === '0x') {
            this.executionPrivateKey = data['execution-private-key'];
        }
        else {
            this.executionPrivateKey = "0x" + data['execution-private-key'];
        }
    }
    /* eslint-enable max-statements, prefer-destructuring */
    // eslint-disable-next-line class-methods-use-this
    ServerConfig.prototype.deleteExpiredSettlements = function () {
        verified_repository_1.default.deleteExpiredSettlementsAndAssociatedCredits();
    };
    ServerConfig.prototype.getConfigResponse = function () {
        return new config_response_1.default({
            creditProtocolAddress: this.creditProtocolAddress,
            ethereumPrices: this.ethereumPrices,
            gasPrice: this.gasPrice,
            lndrAddresses: this.lndrUcacAddrs,
            weekAgoBlock: this.latestBlockNumber - blockNumberStart
        });
    };
    ServerConfig.prototype.getUcac = function (currency) {
        return this.lndrUcacAddrs[currency.toUpperCase()];
    };
    ServerConfig.prototype.heartbeat = function () {
        var _this = this;
        setInterval(function () {
            _this.updateServerConfig();
            _this.deleteExpiredSettlements();
            _this.verifySettlementsWithTxHash();
            console.error('heartbeat');
        }, this.heartbeatInterval);
    };
    /* eslint-disable */
    ServerConfig.prototype.updateServerConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var prices, rates_1, err_1, currentGasPrice, err_2, latestBlockNumber, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, heartbeat_repository_1.default.queryEtheruemPrices()];
                    case 1:
                        prices = _a.sent();
                        rates_1 = prices.data.rates;
                        this.ethereumPrices = Object.keys(rates_1).reduce(function (obj, key) {
                            obj[key.toLowerCase()] = rates_1[key];
                            return obj;
                        }, {});
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.error('Error getting Ethereum prices:', err_1);
                        return [3 /*break*/, 3];
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, heartbeat_repository_1.default.querySafelow()];
                    case 4:
                        currentGasPrice = _a.sent();
                        this.gasPrice = currentGasPrice;
                        return [3 /*break*/, 6];
                    case 5:
                        err_2 = _a.sent();
                        console.error('Error getting gas price:', err_2);
                        return [3 /*break*/, 6];
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, ethereum_interface_repository_1.default.currentBlockNumber()];
                    case 7:
                        latestBlockNumber = _a.sent();
                        this.latestBlockNumber = latestBlockNumber;
                        return [3 /*break*/, 9];
                    case 8:
                        err_3 = _a.sent();
                        console.error('Error getting latest blocknumber:', err_3);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ServerConfig.prototype.verifyRecords = function (credits /* [BilateralCreditRecord]*/) {
        return __awaiter(this, void 0, void 0, function () {
            var firstRecord, firstCreditor, firstDebtor, creditRecords, creditorAmount, debtorAmount, settlementCreditor, settlementDebtor, results, index, record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firstRecord = credits[0];
                        if (!firstRecord || !firstRecord.txHash) {
                            throw new Error('Bilateral Settlement Record does not have txHash.');
                        }
                        firstCreditor = firstRecord.creditRecord.creditor;
                        firstDebtor = firstRecord.creditRecord.debtor;
                        creditRecords = credits.map(function (credit) { return credit.creditRecord; });
                        creditorAmount = 0;
                        debtorAmount = 0;
                        creditRecords.forEach(function (record) {
                            if (record.creditor === firstCreditor && record.settlementAmount) {
                                creditorAmount += record.settlementAmount;
                            }
                            else if (record.debtor === firstCreditor && record.settlementAmount) {
                                debtorAmount += record.settlementAmount;
                            }
                        });
                        settlementCreditor = creditorAmount > debtorAmount ? firstCreditor : firstDebtor;
                        settlementDebtor = creditorAmount > debtorAmount ? firstDebtor : firstCreditor;
                        return [4 /*yield*/, ethereum_interface_repository_1.default.verifySettlementPayment(firstRecord.txHash, settlementCreditor, settlementDebtor, Math.abs(creditorAmount - debtorAmount), firstRecord.creditRecord.settlementCurrency)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Promise.all(creditRecords.map(function (record) { return verified_repository_1.default.verifyCreditByHash(record.hash); }))];
                    case 2:
                        _a.sent();
                        results = [];
                        index = 0;
                        _a.label = 3;
                    case 3:
                        if (!(credits.length > 0)) return [3 /*break*/, 5];
                        record = credits.shift();
                        return [4 /*yield*/, ethereum_interface_repository_1.default.finalizeTransaction(record)
                                .then(function (hash) { return results.push(hash); })
                                .catch(function (err) {
                                console.error('[POST] /multi_settlement', err);
                            })];
                    case 4:
                        _a.sent();
                        index += 1;
                        return [3 /*break*/, 3];
                    case 5:
                        console.error('SETTLEMENTS WEB3: ', results);
                        return [2 /*return*/];
                }
            });
        });
    };
    /* eslint-enable */
    ServerConfig.prototype.verifySettlementsWithTxHash = function () {
        return __awaiter(this, void 0, void 0, function () {
            var txHashes, creditsToVerify, err_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, verified_repository_1.default.txHashesToVerify()];
                    case 1:
                        txHashes = _a.sent();
                        return [4 /*yield*/, Promise.all(txHashes.map(function (hash) { return verified_repository_1.default.lookupCreditsByTxHash(hash); }))];
                    case 2:
                        creditsToVerify = _a.sent();
                        return [4 /*yield*/, Promise.all(creditsToVerify.map(function (creditList) { return _this.verifyRecords(creditList); }))];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_4 = _a.sent();
                        console.error('Error confirming settlements: ', err_4);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return ServerConfig;
}());
exports.ServerConfig = ServerConfig;
var serverConfig = new ServerConfig(configObj);
serverConfig.heartbeat();
exports.default = serverConfig;
//# sourceMappingURL=config.service.js.map