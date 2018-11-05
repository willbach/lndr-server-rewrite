"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_codes_1 = require("../utils/http.codes");
var paypal_request_1 = require("../dto/paypal-request");
var paypal_service_1 = require("../services/paypal.service");
exports.default = {
    deletePayPalRequest: function (req, res) {
        var deleteRequest = new paypal_request_1.default(req.body);
        if (deleteRequest.signatureMatches()) {
            paypal_service_1.default.deletePayPalRequest(deleteRequest)
                .then(function () {
                res.status(http_codes_1.successNoContent).end();
            })
                .catch(function (err) {
                console.error('[POST] /remove_paypal_request', err);
                res.status(http_codes_1.badRequest).json(err);
            });
        }
        else {
            res.status(http_codes_1.unauthorized).json('Signature does not match');
        }
    },
    getPayPalRequests: function (req, res) {
        paypal_service_1.default.getPayPalRequests(req.params.address)
            .then(function (data) {
            res.json(data);
        })
            .catch(function (err) {
            console.error('[GET] /request_paypal', err);
            res.status(http_codes_1.notFound).json(err);
        });
    },
    requestPayPal: function (req, res) {
        var paypalRequest = new paypal_request_1.default(req.body);
        if (paypalRequest.signatureMatches()) {
            paypal_service_1.default.requestPayPal(paypalRequest)
                .then(function () {
                res.status(http_codes_1.successNoContent).end();
            })
                .catch(function (err) {
                console.error('[POST] /request_paypal', err);
                res.status(http_codes_1.badRequest).json(err);
            });
        }
        else {
            res.status(http_codes_1.unauthorized).json('Signature does not match');
        }
    }
};
//# sourceMappingURL=paypal.controller.js.map