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
const dependencies_1 = require("@schematics/angular/utility/dependencies");
const workspace_1 = require("@schematics/angular/utility/workspace");
const config_1 = require("@schematics/angular/utility/config");
exports.packageName = '@ngx-pwa/local-storage';
// TODO: Automate this
exports.packageVersionLatest = '^9.0.3';
exports.packageVersionLTS8 = '^8.2.4';
exports.packageVersionLTS7 = '^6.2.5';
function getAngularMajorVersion(host) {
    const angularDependency = dependencies_1.getPackageJsonDependency(host, '@angular/core');
    /* Throw if Angular is not installed */
    if (angularDependency === null) {
        throw new schematics_1.SchematicsException(`@angular/core is required to install ${exports.packageName}`);
    }
    /* Remove semver signs if present and keep only the first number (major) */
    return Number.parseInt(angularDependency.version.replace('~', '').replace('^', '').substr(0, 1), 10);
}
exports.getAngularMajorVersion = getAngularMajorVersion;
function getAllMainPaths(host) {
    return __awaiter(this, void 0, void 0, function* () {
        const mainPaths = [];
        const workspace = yield workspace_1.getWorkspace(host);
        /* Loop on all projects configured in angular.json */
        workspace.projects.forEach((project) => {
            /* The schematic only work with applications (not librairies) */
            if (project.extensions.projectType === 'application') {
                /* Get `main` option in angular.json project config */
                const buildTarget = project.targets.get('build');
                const e2eTarget = project.targets.get('e2e');
                if (buildTarget) {
                    if (!buildTarget.options || !buildTarget.options.main) {
                        throw new schematics_1.SchematicsException(`angular.json config is broken, can't find 'architect.build.options.main' in one or more projects`);
                    }
                    mainPaths.push(buildTarget.options.main);
                }
                else if (!e2eTarget) {
                    /* In old CLI projects, e2e where distinct applications project, we don't need to throw for them */
                    throw new schematics_1.SchematicsException(`angular.json config is broken, can't find 'architect.build.options.main' in one or more projects`);
                }
            }
        });
        return mainPaths;
    });
}
exports.getAllMainPaths = getAllMainPaths;
function getMainPath(host, userProject) {
    return __awaiter(this, void 0, void 0, function* () {
        const workspace = yield workspace_1.getWorkspace(host);
        const workspaceConfig = config_1.getWorkspace(host);
        /* If no project name was provided, use the default project name */
        const projectName = userProject || workspaceConfig.defaultProject || '';
        const project = workspace.projects.get(projectName);
        if (userProject && !project) {
            throw new schematics_1.SchematicsException(`Invalid project name '${projectName}'`);
        }
        if (!project) {
            throw new schematics_1.SchematicsException(`Can't find a default project, try 'ng add ${exports.packageName} --project yourprojectname'`);
        }
        if (project.extensions.projectType !== 'application') {
            throw new schematics_1.SchematicsException(`'ng add ${exports.packageName}' can only be used for projects with 'projectType': 'application'`);
        }
        /* Get `main` option in angular.json project config */
        const buildTarget = project.targets.get('build');
        if (!buildTarget || !buildTarget.options || !buildTarget.options.main) {
            throw new schematics_1.SchematicsException(`Your angular.json project config is broken, can't find 'architect.build.options.main'`);
        }
        return buildTarget.options.main;
    });
}
exports.getMainPath = getMainPath;
//# sourceMappingURL=config.js.map