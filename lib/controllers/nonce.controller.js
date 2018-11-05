"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nonce_service_1 = require("../services/nonce.service");
var http_codes_1 = require("../utils/http.codes");
exports.default = {
    getNonce: function (req, res) {
        nonce_service_1.default.getNonce(req.params.address1, req.params.address2)
            .then(function (nonce) {
            res.json(nonce);
        })
            .catch(function (err) {
            console.error('[GET] /nonce', err);
            res.status(http_codes_1.notFound).json(err);
        });
    }
};
//# sourceMappingURL=nonce.controller.js.map