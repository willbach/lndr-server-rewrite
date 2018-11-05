"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../db");
exports.default = {
    insertEmail: function (address, email) { return db_1.default.any('INSERT INTO nicknames (address, email) VALUES ($1,$2) ON CONFLICT (address) DO UPDATE SET email = EXCLUDED.email', [address, email]); },
    insertNick: function (address, nick) { return db_1.default.any('INSERT INTO nicknames (address, nickname) VALUES ($1,$2) ON CONFLICT (address) DO UPDATE SET nickname = EXCLUDED.nickname', [address, nick]); },
    lookupAddressByEmail: function (email) { return db_1.default.any('SELECT address, nickname FROM nicknames WHERE email = $1', [email]).then(function (result) {
        if (result.length === 0) {
            return null;
        }
        return result[0];
    }); },
    lookupAddressByNick: function (nick) { return db_1.default.any('SELECT address, nickname FROM nicknames WHERE nickname = $1', [nick]).then(function (result) {
        if (result.length === 0) {
            return null;
        }
        return result[0];
    }); },
    lookupAddressesByFuzzyNick: function (nick) {
        var fuzzyNick = nick + "%";
        return db_1.default.any('SELECT address, nickname FROM nicknames WHERE nickname LIKE $1 LIMIT 10', [fuzzyNick]).then(function (results) { return results.map(function (result) { return ({ addr: result.address, nick: result.nickname }); }); });
    },
    lookupEmail: function (address) { return db_1.default.any('SELECT email FROM nicknames WHERE address = $1', [address]).then(function (result) {
        if (result.length === 0) {
            return null;
        }
        return result[0].email;
    }); },
    lookupNick: function (address) { return db_1.default.any('SELECT nickname FROM nicknames WHERE address = $1', [address]).then(function (result) {
        if (result.length === 0) {
            return null;
        }
        return result[0].nickname;
    }); }
};
//# sourceMappingURL=nicknames.repository.js.map