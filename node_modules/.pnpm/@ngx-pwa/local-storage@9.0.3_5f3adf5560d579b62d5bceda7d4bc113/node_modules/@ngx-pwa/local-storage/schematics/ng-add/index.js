"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const config_1 = require("../utility/config");
const module_1 = require("../utility/module");
const dependency_1 = require("../utility/dependency");
function default_1(options) {
    return (host, context) => __awaiter(this, void 0, void 0, function* () {
        /* Get config */
        const angularMajorVersion = config_1.getAngularMajorVersion(host);
        const mainPath = yield config_1.getMainPath(host, options.project);
        /* Task to run `npm install` (or user package manager) */
        context.addTask(new tasks_1.NodePackageInstallTask());
        return schematics_1.chain([
            dependency_1.addDependency(angularMajorVersion),
            module_1.addModule(angularMajorVersion, mainPath),
        ]);
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map