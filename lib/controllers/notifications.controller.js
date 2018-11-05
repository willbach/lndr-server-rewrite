"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_codes_1 = require("../utils/http.codes");
var push_request_1 = require("../dto/push-request");
var notifications_service_1 = require("../services/notifications.service");
exports.default = {
    registerChannelID: function (req, res) {
        var pushData = new push_request_1.default(req.body);
        if (pushData.signatureMatches()) {
            notifications_service_1.default.registerChannelID(pushData)
                .then(function () {
                res.status(http_codes_1.successNoContent).end();
            })
                .catch(function (err) {
                console.error('[POST] /register_push', err);
                res.status(http_codes_1.badRequest).json(err);
            });
        }
        else {
            res.status(http_codes_1.unauthorized).json('Signature does not match');
        }
    },
    unregisterChannelID: function (req, res) {
        var pushData = new push_request_1.default(req.body);
        if (pushData.signatureMatches()) {
            notifications_service_1.default.unregisterChannelID(pushData)
                .then(function () {
                res.status(http_codes_1.successNoContent).end();
            })
                .catch(function (err) {
                console.error('[POST] /unregister_push', err);
                res.status(http_codes_1.badRequest).json(err);
            });
        }
        else {
            res.status(http_codes_1.unauthorized).json('Signature does not match');
        }
    }
};
//# sourceMappingURL=notifications.controller.js.map