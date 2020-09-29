import { ModuleWithProviders } from '@angular/core';
import { StorageConfig } from './tokens';
/**
 * This module does not contain anything, it's only useful to provide options via `.forRoot()`.
 */
export declare class StorageModule {
    /**
     * Only useful to provide options, otherwise it does nothing.
     * **Must be used at initialization, ie. in `AppModule`, and must not be loaded again in another module.**
     *
     * @example
     * NgModule({
     *   imports: [StorageModule.forRoot({
     *     LSPrefix: 'custom_',
     *   })]
     * })
     * export class AppModule
     */
    static forRoot(config: StorageConfig): ModuleWithProviders<StorageModule>;
}
