"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
var config = fs.readFileSync(path.join(__dirname, '../../data/lndr-server.config.json'), { encoding: 'utf8' });
var dbConfig = JSON.parse(config).db;
var pgp = require('pg-promise')();
var cn = {
    database: dbConfig.name,
    host: dbConfig.host,
    password: dbConfig['user-password'],
    port: dbConfig.port,
    user: dbConfig.user
};
var db = pgp(cn);
exports.default = db;
//# sourceMappingURL=index.js.map