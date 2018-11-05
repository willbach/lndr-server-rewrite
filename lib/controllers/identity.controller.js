"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require('crypto');
var http_codes_1 = require("../utils/http.codes");
var identity_verification_request_1 = require("../dto/identity-verification-request");
var verification_status_request_1 = require("../dto/verification-status-request");
var identity_service_1 = require("../services/identity.service");
var config_service_1 = require("../services/config.service");
exports.default = {
    checkStatus: function (req, res) {
        var statusRequest = new verification_status_request_1.default(req.body);
        if (statusRequest.signatureMatches()) {
            identity_service_1.default.checkStatus(statusRequest)
                .then(function (data) {
                res.json(data);
            })
                .catch(function (err) {
                console.error('[POST] /check_verification_status');
                res.status(http_codes_1.notFound).json(err);
            });
        }
        else {
            res.status(http_codes_1.unauthorized).json('Signature does not match');
        }
    },
    handleCallback: function (req, res) {
        var digest = req.query.digest;
        var computedDigest = crypto.createHmac('sha1', config_service_1.default.sumsubApiCallbackSecret).update(req.body, 'utf8').digest('hex');
        var digestMatches = digest === computedDigest;
        if (digestMatches) {
            identity_service_1.default.handleCallback(req.body)
                .then(function () {
                res.status(http_codes_1.successNoContent).end();
            })
                .catch(function (err) {
                console.error('[POST] /verify_identity_callback');
                res.status(http_codes_1.badRequest).json(err);
            });
        }
        else {
            console.error('computed digest does not match', digest, digestMatches);
            res.status(http_codes_1.unauthorized).json('Digest does not match');
        }
    },
    registerUser: function (req, res) {
        var verificationRequest = new identity_verification_request_1.default(req.body);
        if (verificationRequest.signatureMatches()) {
            identity_service_1.default.registerUser(verificationRequest)
                .then(function (data) {
                res.json(data);
            })
                .catch(function (err) {
                console.error('[POST] /verify_identity');
                res.status(http_codes_1.badRequest).json(err);
            });
        }
        else {
            res.status(http_codes_1.unauthorized).json('Signature does not match');
        }
    }
};
//# sourceMappingURL=identity.controller.js.map