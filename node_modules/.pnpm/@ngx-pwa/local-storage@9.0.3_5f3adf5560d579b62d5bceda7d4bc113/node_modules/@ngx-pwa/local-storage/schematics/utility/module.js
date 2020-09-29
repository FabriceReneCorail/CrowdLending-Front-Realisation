"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const ng_ast_utils_1 = require("@schematics/angular/utility/ng-ast-utils");
const ts = require("typescript");
const config_1 = require("./config");
/**
 * @param mainPath Path of the project `main.ts` file
 * @returns An object with `AppModule` path and source
 */
function getAppModule(host, mainPath) {
    const appModulePath = ng_ast_utils_1.getAppModulePath(host, mainPath);
    if (!host.exists(appModulePath)) {
        throw new schematics_1.SchematicsException(`Can't find AppModule`);
    }
    const appModuleFile = host.read(appModulePath).toString('utf-8');
    return { appModulePath, appModuleFile };
}
function updateAppModule(host, appModulePath, appModuleFile, storageModuleName) {
    /* Third param is to disable transpilation, 4rd note sure I just followed other official schematics */
    const appModuleSource = ts.createSourceFile(appModulePath, appModuleFile, ts.ScriptTarget.Latest, true);
    const appModuleChanges = ast_utils_1.addImportToModule(appModuleSource, appModulePath, storageModuleName, config_1.packageName);
    /* The changes must be applied, otherwise the previous line does nothing */
    const recorder = host.beginUpdate(appModulePath);
    appModuleChanges.forEach((change) => {
        recorder.insertLeft(change.pos, change.toAdd);
    });
    host.commitUpdate(recorder);
}
/**
 * @param mainPath Path of the project `main.ts` file
 */
function addModule(angularMajorVersion, mainPath) {
    return (host) => {
        /* Versions < 8 didn't have `StorageModule` and versions > 9 don't need it */
        if (angularMajorVersion === 8) {
            const { appModulePath, appModuleFile } = getAppModule(host, mainPath);
            /* New applications should have `IDBNoWrap` to `true` to be future-proof, as it will become the default */
            const storageModuleName = `StorageModule.forRoot({ IDBNoWrap: true })`;
            if (appModuleFile.includes(config_1.packageName)) {
                throw new schematics_1.SchematicsException(`This project already uses ${config_1.packageName}, please use 'ng update ${config_1.packageName}' instead`);
            }
            updateAppModule(host, appModulePath, appModuleFile, storageModuleName);
        }
        return host;
    };
}
exports.addModule = addModule;
/**
 * @param mainPath Path of the project `main.ts` file
 */
function updateModule(mainPath) {
    return (host) => {
        const { appModulePath, appModuleFile } = getAppModule(host, mainPath);
        /* If `IDBNoWrap` is already set, it **must not** be changed, otherwise previously stored data would be lost */
        if (!appModuleFile.includes('IDBNoWrap')) {
            if (appModuleFile.includes(config_1.packageName)) {
                /* It's important to keep the current options, otherwise previously stored data would be lost */
                const updatedAppModuleFile = appModuleFile.replace(/StorageModule.forRoot\({(.*)}\)/s, 'StorageModule.forRoot({ IDBNoWrap: false,$1 })');
                /* If the file is still the same, it means we didn't catch the module
                  * (for example, it can happen if the user aliased `StorageModule`) */
                if (updatedAppModuleFile === appModuleFile) {
                    throw new schematics_1.SchematicsException(`We couldn't update AppModule automatically. Be sure to follow the documentation to update manually, otherwise previsouly stored data could be lost.`);
                }
                host.overwrite(appModulePath, updatedAppModuleFile);
            }
            else {
                /* `IDBNoWrap` **must** be `false` in existing applications, otherwise previously stored data would be lost */
                const storageModuleName = `StorageModule.forRoot({ IDBNoWrap: false })`;
                updateAppModule(host, appModulePath, appModuleFile, storageModuleName);
            }
        }
        return host;
    };
}
exports.updateModule = updateModule;
/**
 * @param mainPath Path of the project `main.ts` file
 */
function updateModuleToV9(mainPath) {
    return (host) => {
        const { appModulePath, appModuleFile } = getAppModule(host, mainPath);
        /* If `IDBNoWrap` is already set, it **must not** be changed, otherwise previously stored data would be lost */
        if (!appModuleFile.includes('IDBNoWrap')) {
            if (appModuleFile.includes(config_1.packageName)) {
                /* It's important to keep the current options, otherwise previously stored data would be lost */
                const updatedAppModuleFile = appModuleFile.replace(/StorageModule.forRoot\({(.*)}\)/s, 'StorageModule.forRoot({ IDBNoWrap: false,$1 })');
                /* If the file is still the same, it means we didn't catch the module
                  * (for example, it can happen if the user aliased `StorageModule`) */
                if (updatedAppModuleFile === appModuleFile) {
                    throw new schematics_1.SchematicsException(`We couldn't update AppModule automatically, please check documentation for manual update`);
                }
                host.overwrite(appModulePath, updatedAppModuleFile);
            }
            else {
                /* `IDBNoWrap` **must** be `false` in existing applications, otherwise previously stored data would be lost */
                const storageModuleName = `StorageModule.forRoot({ IDBNoWrap: false })`;
                updateAppModule(host, appModulePath, appModuleFile, storageModuleName);
            }
        }
        return host;
    };
}
exports.updateModuleToV9 = updateModuleToV9;
//# sourceMappingURL=module.js.map