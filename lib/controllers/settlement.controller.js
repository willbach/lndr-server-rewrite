"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_codes_1 = require("../utils/http.codes");
var verify_settlement_request_1 = require("../dto/verify-settlement-request");
var settlement_service_1 = require("../services/settlement.service");
exports.default = {
    getPendingSettlements: function (req, res) {
        settlement_service_1.default.getPendingSettlements(req.params.address)
            .then(function (data) {
            res.json(data);
        })
            .catch(function (err) {
            console.error('[GET] /pending_settlements', err);
            res.status(http_codes_1.notFound).json(err);
        });
    },
    getTxHash: function (req, res) {
        settlement_service_1.default.getTxHash(req.params.creditHash)
            .then(function (data) {
            res.json(data);
        })
            .catch(function (err) {
            console.error('[GET] /tx_hash', err);
            res.status(http_codes_1.notFound).json(err);
        });
    },
    verifySettlement: function (req, res) {
        var verification = new verify_settlement_request_1.default(req.body);
        if (verification.signatureMatches()) {
            settlement_service_1.default.verifySettlement(verification)
                .then(function () {
                res.status(http_codes_1.successNoContent).end();
            })
                .catch(function (err) {
                console.error('[POST] /verify_settlement', err);
                res.status(http_codes_1.badRequest).json(err);
            });
        }
        else {
            res.status(http_codes_1.unauthorized).json('Signature does not match');
        }
    }
};
//# sourceMappingURL=settlement.controller.js.map