"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_service_1 = require("../services/config.service");
exports.default = {
    getConfig: function (_req, res) {
        res.json(config_service_1.default.getConfigResponse());
    }
};
//# sourceMappingURL=config.controller.js.map