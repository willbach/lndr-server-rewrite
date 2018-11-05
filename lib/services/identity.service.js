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
var verification_status_entry_1 = require("../dto/verification-status-entry");
var identity_repository_1 = require("../repositories/identity.repository");
exports.default = {
    // eslint-disable-next-line complexity, max-statements
    checkStatus: function (statusRequest) { return __awaiter(_this, void 0, void 0, function () {
        var storedStatus, checkedStatus;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, identity_repository_1.default.lookupVerificationStatus(statusRequest.user)];
                case 1:
                    storedStatus = _a.sent();
                    if (!(storedStatus && storedStatus.length > 0 && storedStatus[0].status)) return [3 /*break*/, 2];
                    return [2 /*return*/, new verification_status_entry_1.default(storedStatus[0])];
                case 2:
                    if (!(storedStatus && storedStatus.length > 0 && storedStatus[0].applicant_id)) return [3 /*break*/, 6];
                    return [4 /*yield*/, identity_repository_1.default.getVerificationStatus(storedStatus.applicant_id)];
                case 3:
                    checkedStatus = _a.sent();
                    if (!(checkedStatus && checkedStatus.review && checkedStatus.review.reviewAnswer)) return [3 /*break*/, 5];
                    return [4 /*yield*/, identity_repository_1.default.addVerificationStatus(checkedStatus.externalUserId, checkedStatus.applicantId, checkedStatus.review.reviewAnswer)];
                case 4:
                    _a.sent();
                    return [2 /*return*/, new verification_status_entry_1.default({
                            address: checkedStatus.externalUserId,
                            applicantId: checkedStatus.applicantId,
                            status: checkedStatus.review.reviewAnswer
                        })];
                case 5: throw new Error('Unable to get applicant status');
                case 6: throw new Error('Unable to get applicant status');
            }
        });
    }); },
    handleCallback: function (status) { return identity_repository_1.default.addVerificationStatus(status.externalUserId, status.applicantId, status.review.reviewAnswer); },
    registerUser: function (verificationRequest) { return __awaiter(_this, void 0, void 0, function () {
        var idDocs, verificationResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    idDocs = verificationRequest.idDocs;
                    if (!idDocs) {
                        throw new Error('No idDocs attached');
                    }
                    return [4 /*yield*/, identity_repository_1.default.sendVerificationRequest(verificationRequest)];
                case 1:
                    verificationResult = _a.sent();
                    return [2 /*return*/, Promise.all(idDocs.map(function (document) { return identity_repository_1.default.sendVerificationDocument(verificationResult.id, document); }))];
            }
        });
    }); }
};
// IdentityStatusReview { reviewAnswer :: Text
//   , clientComment :: Text
//   , moderationComment :: Maybe Text
//   , rejectLabels :: Maybe [String]
//   , reviewRejectType :: Maybe Text
// }
// IdentityVerificationStatus { applicantId :: Text
//   , inspectionId :: Text
//   , correlationId :: Text
//   , jobId :: Text
//   , externalUserId :: Address
//   , success :: Bool
//   , details :: Maybe Text
//   , _type :: Text
//   , review :: IdentityStatusReview
// }
//# sourceMappingURL=identity.service.js.map