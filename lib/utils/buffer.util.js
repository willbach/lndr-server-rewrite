"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToBuffer = function (value) {
    var newValue = value;
    if (value.substr(0, 2) === '0x') {
        newValue = value.substr(2);
    }
    return Buffer.from(newValue, 'hex');
};
exports.stringToBuffer = function (value) { return Buffer.from(value); };
exports.bufferToHex = function (buffer) { return buffer.toString('hex'); };
exports.utf8ToBuffer = function (value) { return Buffer.from(value, 'utf8'); };
exports.int32ToBuffer = function (value) {
    var hexValue = value.toString(16);
    var z = '00000000', x = "" + z + z;
    var stringValue = ("" + x + x + x + x).replace(new RegExp(".{" + hexValue.length + "}$"), hexValue);
    return Buffer.from(stringValue, 'hex');
};
exports.stripHexPrefix = function (value) {
    if (value.substr(0, 2) === '0x') {
        return value.slice(2);
    }
    return value;
};
//# sourceMappingURL=buffer.util.js.map