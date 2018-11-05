"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../db");
exports.default = {
    addFriends: function (address, friend) { return db_1.default.any('INSERT INTO friendships (origin, friend) VALUES ($1,$2) ON CONFLICT ON CONSTRAINT friendships_origin_friend_key DO NOTHING', [address, friend]); },
    lookupFriends: function (address) { return db_1.default.any('SELECT inbound.origin, nicknames.nickname FROM friendships inbound INNER JOIN friendships outbound ON inbound.friend = outbound.origin AND inbound.origin = outbound.friend LEFT JOIN nicknames ON nicknames.address = inbound.origin WHERE inbound.friend = $1', [address]).then(function (data) { return data.map(function (entry) { return ({ addr: entry.origin, nick: entry.nickname }); }); }); },
    lookupInboundFriendRequests: function (address) { return db_1.default.any('SELECT inbound.origin, nicknames.nickname FROM friendships inbound LEFT JOIN friendships outbound ON inbound.friend = outbound.origin AND inbound.origin = outbound.friend LEFT JOIN nicknames ON nicknames.address = inbound.origin WHERE inbound.friend = $1 AND outbound.friend IS NULL', [address]).then(function (data) { return data.map(function (entry) { return ({ addr: entry.origin, nick: entry.nickname }); }); }); },
    lookupOutboundFriendRequests: function (address) { return db_1.default.any('SELECT outbound.friend, nicknames.nickname FROM friendships outbound LEFT JOIN friendships inbound ON outbound.friend = inbound.origin AND outbound.origin = inbound.friend LEFT JOIN nicknames ON nicknames.address = outbound.friend WHERE outbound.origin = $1 AND inbound.friend IS NULL', [address]).then(function (data) { return data.map(function (entry) { return ({ addr: entry.friend, nick: entry.nickname }); }); }); },
    removeFriends: function (address, addresses) { return db_1.default.any('DELETE FROM friendships WHERE origin = $1 AND friend IN ($2:csv) OR friend = $1 AND origin IN ($2:csv)', [address, addresses]); },
    sentFriendRequestTo: function (address, friendAddresses) { return db_1.default.any('SELECT inbound.friend FROM friendships inbound LEFT JOIN friendships outbound ON inbound.friend = outbound.origin AND inbound.origin = outbound.friend WHERE inbound.origin = $1 AND inbound.friend IN ($2:csv) AND outbound.friend IS NULL', [address, friendAddresses]); }
};
//# sourceMappingURL=friends.repository.js.map