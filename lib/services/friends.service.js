"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var friends_repository_1 = require("../repositories/friends.repository");
exports.default = {
    addFriends: function (address, friendList) { return Promise.all(friendList.map(function (friend) { return friends_repository_1.default.addFriends(address, friend); })); },
    getFriendList: function (address) { return friends_repository_1.default.lookupFriends(address); },
    getFriendRequests: function (address) { return friends_repository_1.default.lookupInboundFriendRequests(address); },
    getOutboudFriendRequests: function (address) { return friends_repository_1.default.lookupOutboundFriendRequests(address); },
    removeFriends: function (address, friendList) { return friends_repository_1.default.removeFriends(address, friendList); }
};
//# sourceMappingURL=friends.service.js.map