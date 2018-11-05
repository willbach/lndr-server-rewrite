"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var notifications_repository_1 = require("../repositories/notifications.repository");
exports.default = {
    registerChannelID: function (pushData) { return notifications_repository_1.default.insertPushDatum(pushData.channelID, pushData.address, pushData.platform); },
    unregisterChannelID: function (pushData) { return notifications_repository_1.default.deletePushDatum(pushData.channelID, pushData.address, pushData.platform); }
};
//# sourceMappingURL=notifications.service.js.map