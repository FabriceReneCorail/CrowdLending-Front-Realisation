import { Tree } from '@angular-devkit/schematics';
export declare const packageName = "@ngx-pwa/local-storage";
export declare const packageVersionLatest = "^9.0.3";
export declare const packageVersionLTS8 = "^8.2.4";
export declare const packageVersionLTS7 = "^6.2.5";
export declare function getAngularMajorVersion(host: Tree): number;
export declare function getAllMainPaths(host: Tree): Promise<string[]>;
export declare function getMainPath(host: Tree, userProject?: string): Promise<string>;
