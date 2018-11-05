"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_codes_1 = require("../utils/http.codes");
var friends_service_1 = require("../services/friends.service");
exports.default = {
    addFriends: function (req, res) {
        friends_service_1.default.addFriends(req.params.address, req.body)
            .then(function () {
            res.status(http_codes_1.successNoContent).end();
        })
            .catch(function (err) {
            console.error('[POST] /add_friends', err);
            res.status(http_codes_1.badRequest).json(err);
        });
    },
    getFriendList: function (req, res) {
        friends_service_1.default.getFriendList(req.params.address)
            .then(function (data) {
            res.json(data);
        })
            .catch(function (err) {
            console.error('[GET] /friends', err);
            res.status(http_codes_1.notFound).json(err);
        });
    },
    getFriendRequests: function (req, res) {
        friends_service_1.default.getFriendRequests(req.params.address)
            .then(function (data) {
            res.json(data);
        })
            .catch(function (err) {
            console.error('[GET] /friend_requests', err);
            res.status(http_codes_1.notFound).json(err);
        });
    },
    getOutboudFriendRequests: function (req, res) {
        friends_service_1.default.getOutboudFriendRequests(req.params.address)
            .then(function (data) {
            res.json(data);
        })
            .catch(function (err) {
            console.error('[GET] /outbound_friend_requests', err);
            res.status(http_codes_1.notFound).json(err);
        });
    },
    removeFriends: function (req, res) {
        friends_service_1.default.removeFriends(req.params.address, req.body)
            .then(function () {
            res.status(http_codes_1.successNoContent).end();
        })
            .catch(function (err) {
            console.error('[POST] /remove_friends', err);
            res.status(http_codes_1.badRequest).json(err);
        });
    }
};
//# sourceMappingURL=friends.controller.js.map