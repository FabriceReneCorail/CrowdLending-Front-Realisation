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
const config_1 = require("../utility/config");
const module_1 = require("../utility/module");
function updateToV8() {
    return (host) => __awaiter(this, void 0, void 0, function* () {
        /* Get config */
        const mainPaths = yield config_1.getAllMainPaths(host);
        /* Update `AppModule` of all projects */
        return schematics_1.chain(mainPaths.map((mainPath) => module_1.updateModule(mainPath)));
    });
}
exports.updateToV8 = updateToV8;
function updateToV9() {
    return (host) => __awaiter(this, void 0, void 0, function* () {
        /* Get config */
        const mainPaths = yield config_1.getAllMainPaths(host);
        /* Update `AppModule` of all projects */
        return schematics_1.chain(mainPaths.map((mainPath) => module_1.updateModule(mainPath)));
    });
}
exports.updateToV9 = updateToV9;
//# sourceMappingURL=index.js.map