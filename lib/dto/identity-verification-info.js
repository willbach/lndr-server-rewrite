"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IdentityAddress = /** @class */ (function () {
    function IdentityAddress(data) {
        this.street = data.street;
        this.flatNumber = data.flatNumber;
        this.town = data.town;
        this.state = data.state;
        this.postCode = data.postCode;
        this.country = data.country;
    }
    return IdentityAddress;
}());
var IdentityVerificationInfo = /** @class */ (function () {
    function IdentityVerificationInfo(data) {
        this.country = data.country;
        this.firstName = data.firstName;
        this.middleName = data.middleName;
        this.lastName = data.lastName;
        this.phone = data.phone;
        this.dob = data.dob;
        this.nationality = data.nationality;
        this.addresses = data.addresses.map(function (address) { return new IdentityAddress(address); });
    }
    return IdentityVerificationInfo;
}());
exports.default = IdentityVerificationInfo;
//# sourceMappingURL=identity-verification-info.js.map