import { Rule } from '@angular-devkit/schematics';
/**
 * @param mainPath Path of the project `main.ts` file
 */
export declare function addModule(angularMajorVersion: number, mainPath: string): Rule;
/**
 * @param mainPath Path of the project `main.ts` file
 */
export declare function updateModule(mainPath: string): Rule;
/**
 * @param mainPath Path of the project `main.ts` file
 */
export declare function updateModuleToV9(mainPath: string): Rule;
