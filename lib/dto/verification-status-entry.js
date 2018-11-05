"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VerificationStatusEntry = /** @class */ (function () {
    function VerificationStatusEntry(data) {
        this.user = data.address;
        this.sumsubId = data.applicant_id ? data.applicant_id : data.applicantId;
        this.status = data.status;
    }
    return VerificationStatusEntry;
}());
exports.default = VerificationStatusEntry;
//# sourceMappingURL=verification-status-entry.js.map