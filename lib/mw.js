"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var managers_json_1 = __importDefault(require("../src/managers.json"));
var applicants_json_1 = __importDefault(require("../src/applicants.json"));
var Manager = /** @class */ (function () {
    function Manager(name, prefStr, maxPartners) {
        this.prefrences = [];
        this.partners = [];
        this.name = name;
        this.prefStr = prefStr;
        this.maxParteners = maxPartners;
    }
    Manager.prototype.init = function () {
        this.prefrences = this.prefStr.map(function (applicantStr) { return allApplicants.find(function (a) { return a.name === applicantStr; }); });
    };
    return Manager;
}());
var Applicant = /** @class */ (function () {
    function Applicant(name, prefStr) {
        this.prefrences = [];
        this.partner = null;
        this.name = name;
        this.prefStr = prefStr;
    }
    Applicant.prototype.init = function () {
        this.prefrences = this.prefStr.map(function (managerStr) { return allManagers.find(function (m) { return m.name === managerStr; }); });
    };
    return Applicant;
}());
var allManagers = [];
var allApplicants = [];
Object.keys(managers_json_1.default).forEach(function (current) {
    allManagers.push(new Manager(current, managers_json_1.default[current].prefrences, managers_json_1.default[current].maxParteners));
});
Object.keys(applicants_json_1.default).forEach(function (current) {
    allApplicants.push(new Applicant(current, applicants_json_1.default[current].prefrences));
});
allManagers.forEach(function (manager) { return manager.init(); });
allApplicants.forEach(function (applicant) { return applicant.init(); });
//returns true if a prefers m1 over m2
function prefrence(a, m1, m2) {
    return a.prefrences.indexOf(m1) < a.prefrences.indexOf(m2);
}
function removeByValue(arr, ele) {
    return arr.splice(arr.indexOf(ele), 1);
}
function print() {
    console.log("Managers:");
    allManagers.forEach(function (manager) { return console.log(manager.name + " : " + (manager.partners.length === 0 ? 'null' : manager.partners.map(function (a) { return a.name; }).join(', ')) + " " + (freeManagers.indexOf(manager) === -1 ? ' ' : '*')); });
    console.log('\nApplicants');
    allApplicants.forEach(function (applicant) { return console.log(applicant.name + " : " + (applicant.partner ? applicant.partner.name : 'null')); });
    console.log('\n');
}
var freeManagers = allManagers.map(function (man) { return man; }, []);
var managerIndex = 0;
var applicantIndex = 0;
var maxApplicantIndex = Math.max.apply(Math, allManagers.map(function (man) { return man.prefrences.length; }, [])) + 1;
var madeChange = false;
while (freeManagers.length > 0) {
    print();
    var currentManager = freeManagers[managerIndex];
    if (currentManager) {
        var prefrenceA = currentManager.prefrences[applicantIndex];
        if (prefrenceA) {
            if (prefrenceA.partner === null) {
                if (prefrenceA.prefrences.indexOf(currentManager) != -1) {
                    prefrenceA.partner = currentManager;
                    currentManager.partners.push(prefrenceA);
                    if (currentManager.partners.length >= currentManager.maxParteners) {
                        removeByValue(freeManagers, currentManager);
                    }
                    madeChange = true;
                }
            }
            else {
                var currentPrefM = prefrenceA.partner;
                if (prefrence(prefrenceA, currentManager, currentPrefM)) {
                    if (prefrenceA.prefrences.indexOf(currentManager) != -1) {
                        removeByValue(currentPrefM.partners, prefrenceA);
                        if (currentPrefM.partners.length < currentPrefM.maxParteners) {
                            freeManagers.push(currentPrefM);
                        }
                        prefrenceA.partner = currentManager;
                        currentManager.partners.push(prefrenceA);
                        if (currentManager.partners.length >= currentManager.maxParteners) {
                            removeByValue(freeManagers, currentManager);
                        }
                        madeChange = true;
                    }
                }
            }
        }
    }
    managerIndex++;
    if (managerIndex >= freeManagers.length) {
        managerIndex = 0;
        applicantIndex++;
        if (applicantIndex >= maxApplicantIndex) {
            applicantIndex = 0;
            if (!madeChange) {
                break;
            }
            madeChange = false;
        }
    }
}
print();
//# sourceMappingURL=mw.js.map