import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { LS_PREFIX, IDB_DB_NAME, IDB_STORE_NAME, IDB_DB_VERSION, IDB_NO_WRAP } from './tokens';
/**
 * This module does not contain anything, it's only useful to provide options via `.forRoot()`.
 */
var StorageModule = /** @class */ (function () {
    function StorageModule() {
    }
    StorageModule_1 = StorageModule;
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
    StorageModule.forRoot = function (config) {
        return {
            ngModule: StorageModule_1,
            providers: [
                config.LSPrefix ? { provide: LS_PREFIX, useValue: config.LSPrefix } : [],
                config.IDBDBName ? { provide: IDB_DB_NAME, useValue: config.IDBDBName } : [],
                config.IDBStoreName ? { provide: IDB_STORE_NAME, useValue: config.IDBStoreName } : [],
                config.IDBDBVersion ? { provide: IDB_DB_VERSION, useValue: config.IDBDBVersion } : [],
                (config.IDBNoWrap === false) ? { provide: IDB_NO_WRAP, useValue: config.IDBNoWrap } : [],
            ],
        };
    };
    var StorageModule_1;
    StorageModule = StorageModule_1 = __decorate([
        NgModule()
    ], StorageModule);
    return StorageModule;
}());
export { StorageModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LXB3YS9sb2NhbC1zdG9yYWdlLyIsInNvdXJjZXMiOlsibGliL3N0b3JhZ2UubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBaUIsTUFBTSxVQUFVLENBQUM7QUFFOUc7O0dBRUc7QUFFSDtJQUFBO0lBMkJBLENBQUM7c0JBM0JZLGFBQWE7SUFFeEI7Ozs7Ozs7Ozs7O09BV0c7SUFDSSxxQkFBTyxHQUFkLFVBQWUsTUFBcUI7UUFDbEMsT0FBTztZQUNMLFFBQVEsRUFBRSxlQUFhO1lBQ3ZCLFNBQVMsRUFBRTtnQkFDVCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDeEUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzVFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNyRixNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDckYsQ0FBQyxNQUFNLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTthQUN6RjtTQUNGLENBQUM7SUFDSixDQUFDOztJQXpCVSxhQUFhO1FBRHpCLFFBQVEsRUFBRTtPQUNFLGFBQWEsQ0EyQnpCO0lBQUQsb0JBQUM7Q0FBQSxBQTNCRCxJQTJCQztTQTNCWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgTFNfUFJFRklYLCBJREJfREJfTkFNRSwgSURCX1NUT1JFX05BTUUsIElEQl9EQl9WRVJTSU9OLCBJREJfTk9fV1JBUCwgU3RvcmFnZUNvbmZpZyB9IGZyb20gJy4vdG9rZW5zJztcblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBkb2VzIG5vdCBjb250YWluIGFueXRoaW5nLCBpdCdzIG9ubHkgdXNlZnVsIHRvIHByb3ZpZGUgb3B0aW9ucyB2aWEgYC5mb3JSb290KClgLlxuICovXG5ATmdNb2R1bGUoKVxuZXhwb3J0IGNsYXNzIFN0b3JhZ2VNb2R1bGUge1xuXG4gIC8qKlxuICAgKiBPbmx5IHVzZWZ1bCB0byBwcm92aWRlIG9wdGlvbnMsIG90aGVyd2lzZSBpdCBkb2VzIG5vdGhpbmcuXG4gICAqICoqTXVzdCBiZSB1c2VkIGF0IGluaXRpYWxpemF0aW9uLCBpZS4gaW4gYEFwcE1vZHVsZWAsIGFuZCBtdXN0IG5vdCBiZSBsb2FkZWQgYWdhaW4gaW4gYW5vdGhlciBtb2R1bGUuKipcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogTmdNb2R1bGUoe1xuICAgKiAgIGltcG9ydHM6IFtTdG9yYWdlTW9kdWxlLmZvclJvb3Qoe1xuICAgKiAgICAgTFNQcmVmaXg6ICdjdXN0b21fJyxcbiAgICogICB9KV1cbiAgICogfSlcbiAgICogZXhwb3J0IGNsYXNzIEFwcE1vZHVsZVxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoY29uZmlnOiBTdG9yYWdlQ29uZmlnKTogTW9kdWxlV2l0aFByb3ZpZGVyczxTdG9yYWdlTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTdG9yYWdlTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIGNvbmZpZy5MU1ByZWZpeCA/IHsgcHJvdmlkZTogTFNfUFJFRklYLCB1c2VWYWx1ZTogY29uZmlnLkxTUHJlZml4IH0gOiBbXSxcbiAgICAgICAgY29uZmlnLklEQkRCTmFtZSA/IHsgcHJvdmlkZTogSURCX0RCX05BTUUsIHVzZVZhbHVlOiBjb25maWcuSURCREJOYW1lIH0gOiBbXSxcbiAgICAgICAgY29uZmlnLklEQlN0b3JlTmFtZSA/IHsgcHJvdmlkZTogSURCX1NUT1JFX05BTUUsIHVzZVZhbHVlOiBjb25maWcuSURCU3RvcmVOYW1lIH0gOiBbXSxcbiAgICAgICAgY29uZmlnLklEQkRCVmVyc2lvbiA/IHsgcHJvdmlkZTogSURCX0RCX1ZFUlNJT04sIHVzZVZhbHVlOiBjb25maWcuSURCREJWZXJzaW9uIH0gOiBbXSxcbiAgICAgICAgKGNvbmZpZy5JREJOb1dyYXAgPT09IGZhbHNlKSA/IHsgcHJvdmlkZTogSURCX05PX1dSQVAsIHVzZVZhbHVlOiBjb25maWcuSURCTm9XcmFwIH0gOiBbXSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxuXG59XG4iXX0=