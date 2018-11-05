"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var balance_service_1 = require("../services/balance.service");
var http_codes_1 = require("../utils/http.codes");
exports.default = {
    getBalance: function (req, res) {
        balance_service_1.default.getBalance(req.params.address, req.query.currency)
            .then(function (data) {
            res.json(data);
        })
            .catch(function (err) {
            console.error('[GET] /balance', err);
            res.status(http_codes_1.notFound).json(err);
        });
    },
    getCounterParties: function (req, res) {
        balance_service_1.default.getCounterParties(req.params.address)
            .then(function (data) {
            res.json(data);
        })
            .catch(function (err) {
            console.error('[GET] /counterparties', err);
            res.status(http_codes_1.notFound).json(err);
        });
    },
    getTwoPartyBalance: function (req, res) {
        var _a = req.params, address1 = _a.address1, address2 = _a.address2;
        balance_service_1.default.getTwoPartyBalance(address1, address2, req.query.currency)
            .then(function (data) {
            res.json(data);
        })
            .catch(function (err) {
            console.error('[GET] /balance', err);
            res.status(http_codes_1.notFound).json(err);
        });
    }
};
//# sourceMappingURL=balance.controller.js.map