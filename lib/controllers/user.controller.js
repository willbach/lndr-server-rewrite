"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_codes_1 = require("../utils/http.codes");
var email_request_1 = require("../dto/email-request");
var nick_request_1 = require("../dto/nick-request");
var profile_photo_request_1 = require("../dto/profile-photo-request");
var user_service_1 = require("../services/user.service");
exports.default = {
    getEmail: function (req, res) {
        user_service_1.default.getEmail(req.params.address)
            .then(function (data) {
            res.json(data);
        })
            .catch(function (err) {
            console.error('[GET] /email', err);
            res.status(http_codes_1.notFound).json(err);
        });
    },
    getNickname: function (req, res) {
        user_service_1.default.getNickname(req.params.address)
            .then(function (data) {
            res.json(data);
        })
            .catch(function (err) {
            console.error('[GET] /nick', err);
            res.status(http_codes_1.notFound).json(err);
        });
    },
    getUserInfo: function (req, res) {
        user_service_1.default.getUserInfo(req.query.email, req.query.nick)
            .then(function (data) {
            if (data) {
                res.json(data);
            }
            else {
                res.status(http_codes_1.notFound).end();
            }
        })
            .catch(function (err) {
            console.error('[GET] /user: ', err);
            res.status(http_codes_1.notFound).json(err);
        });
    },
    searchNicknames: function (req, res) {
        user_service_1.default.searchNicknames(req.params.nick)
            .then(function (data) {
            res.json(data);
        })
            .catch(function (err) {
            console.error('[GET] /search_nicknames', err);
            res.status(http_codes_1.notFound).json(err);
        });
    },
    setEmail: function (req, res) {
        var emailRequest = new email_request_1.default(req.body);
        if (emailRequest.signatureMatches()) {
            user_service_1.default.setEmail(emailRequest)
                .then(function () {
                res.status(http_codes_1.successNoContent).end();
            })
                .catch(function (err) {
                console.error('[POST] /email', err);
                res.status(http_codes_1.badRequest).json(err);
            });
        }
        else {
            res.status(http_codes_1.unauthorized).json('Signature does not match');
        }
    },
    setNickname: function (req, res) {
        var nickRequest = new nick_request_1.default(req.body);
        if (nickRequest.signatureMatches()) {
            user_service_1.default.setNickname(nickRequest)
                .then(function () {
                res.status(http_codes_1.successNoContent).end();
            })
                .catch(function (err) {
                console.error('[POST] /nick', err);
                res.status(http_codes_1.badRequest).json(err);
            });
        }
        else {
            res.status(http_codes_1.unauthorized).json('Signature does not match');
        }
    },
    setProfilePhoto: function (req, res) {
        var photoRequest = new profile_photo_request_1.default(req.body);
        user_service_1.default.setProfilePhoto(photoRequest)
            .then(function () {
            res.status(http_codes_1.successNoContent).end();
        })
            .catch(function (err) {
            console.error('[POST] /profile_photo', err);
            res.status(http_codes_1.badRequest).json(err);
        });
    }
};
//# sourceMappingURL=user.controller.js.map