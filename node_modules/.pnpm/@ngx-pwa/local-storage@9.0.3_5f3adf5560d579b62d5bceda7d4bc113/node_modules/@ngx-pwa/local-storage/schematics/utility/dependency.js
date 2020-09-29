"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const dependencies_1 = require("@schematics/angular/utility/dependencies");
const config_1 = require("./config");
function addDependency(angularMajorVersion) {
    return (host) => {
        /* Set lib version depending on Angular version */
        let packageVersion = config_1.packageVersionLatest;
        /* Throw on unsupported versions */
        if (angularMajorVersion >= 2 && angularMajorVersion <= 5) {
            throw new schematics_1.SchematicsException('Angular versions < 6 are no longer supported.');
        }
        /* Manage LTS versions */
        if (angularMajorVersion === 6 || angularMajorVersion === 7) {
            packageVersion = config_1.packageVersionLTS7;
        }
        else if (angularMajorVersion === 8) {
            packageVersion = config_1.packageVersionLTS8;
        }
        dependencies_1.addPackageJsonDependency(host, {
            /* Default = prod dependency */
            type: dependencies_1.NodeDependencyType.Default,
            name: config_1.packageName,
            version: packageVersion,
            /* Angular CLI will have pre-installed the package to get the schematics,
             * so we need to overwrite to install the good versions */
            overwrite: true,
        });
        return host;
    };
}
exports.addDependency = addDependency;
//# sourceMappingURL=dependency.js.map