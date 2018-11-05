"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigResponse = /** @class */ (function () {
    function ConfigResponse(data) {
        this.lndrAddresses = data.lndrAddresses;
        this.creditProtocolAddress = data.creditProtocolAddress;
        this.gasPrice = data.gasPrice;
        this.ethereumPrices = data.ethereumPrices;
        this.weekAgoBlock = data.weekAgoBlock;
    }
    return ConfigResponse;
}());
exports.default = ConfigResponse;
//# sourceMappingURL=config-response.js.map