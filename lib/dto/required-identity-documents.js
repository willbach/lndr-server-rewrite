"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IdentityDocumentType = /** @class */ (function () {
    function IdentityDocumentType(data) {
        this.idDocSetType = data.idDocSetType;
        this.types = data.types;
        this.subTypes = data.subTypes;
    }
    return IdentityDocumentType;
}());
var RequiredIdentityDocuments = /** @class */ (function () {
    function RequiredIdentityDocuments(data) {
        this.country = data.country;
        this.docSets = data.docSets.map(function (set) { return new IdentityDocumentType(set); });
    }
    return RequiredIdentityDocuments;
}());
exports.default = RequiredIdentityDocuments;
//# sourceMappingURL=required-identity-documents.js.map