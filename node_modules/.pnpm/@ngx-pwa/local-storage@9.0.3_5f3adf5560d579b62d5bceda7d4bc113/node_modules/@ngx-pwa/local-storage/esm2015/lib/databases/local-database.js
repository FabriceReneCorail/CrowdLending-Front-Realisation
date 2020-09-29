import { __decorate } from "tslib";
import { Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IndexedDBDatabase } from './indexeddb-database';
import { LocalStorageDatabase } from './localstorage-database';
import { MemoryDatabase } from './memory-database';
import { IDB_STORE_NAME, IDB_DB_NAME, LS_PREFIX, IDB_DB_VERSION, IDB_NO_WRAP } from '../tokens';
import * as i0 from "@angular/core";
import * as i1 from "../tokens";
/**
 * Factory to create a storage according to browser support
 * @param platformId Context about the platform (`browser`, `server`...)
 * @param LSPrefix Prefix for `localStorage` keys to avoid collision for multiple apps on the same subdomain
 * @param IDBDBName `indexedDB` database name
 * @param IDBstoreName `indexedDB` storeName name
 * @see {@link https://github.com/cyrilletuzi/angular-async-local-storage/blob/master/docs/BROWSERS_SUPPORT.md}
 */
export function localDatabaseFactory(platformId, LSPrefix, IDBDBName, IDBStoreName, IDBDBVersion, IDBNoWrap) {
    /* When storage is fully disabled in browser (via the "Block all cookies" option),
     * just trying to check `indexedDB` or `localStorage` variables causes a security exception.
     * Prevents https://github.com/cyrilletuzi/angular-async-local-storage/issues/118
     */
    try {
        // Do not explicit `window` here, as the global object is not the same in web workers
        if (isPlatformBrowser(platformId) && (indexedDB !== undefined) && (indexedDB !== null) && ('open' in indexedDB)) {
            /* Check:
            * - if we are in a browser context (issue: server-side rendering)
            * - if `indexedDB` exists (issue: IE9)
            * - it could exist but be `undefined` or `null` (issue: IE / Edge private mode)
            * - it could exists but not having a working API
            * Will be the case for:
            * - IE10+ and all other browsers in normal mode
            * - Chromium / Safari private mode, but in this case, data will be swiped when the user leaves the app */
            return new IndexedDBDatabase(IDBDBName, IDBStoreName, IDBDBVersion, IDBNoWrap);
        }
        else if (isPlatformBrowser(platformId)
            && (localStorage !== undefined) && (localStorage !== null) && ('getItem' in localStorage)) {
            /* Check:
            * - if we are in a browser context (issue: server-side rendering)
            * - if `localStorage` exists (to be sure)
            * - it could exists but not having a working API
            * Will be the case for:
            * - IE9
            * - Safari cross-origin iframes, detected later in `IndexedDBDatabase.connect()`
            * @see {@link https://github.com/cyrilletuzi/angular-async-local-storage/issues/42}
            * - IE / Edge / Firefox private mode, but in this case, data will be swiped when the user leaves the app
            * For Firefox, can only be detected later in `IndexedDBDatabase.connect()`
            * @see {@link https://bugzilla.mozilla.org/show_bug.cgi?id=781982}
            */
            return new LocalStorageDatabase(LSPrefix);
        }
    }
    catch (_a) { }
    /* Will be the case for:
     * - In browsers if storage has been fully disabled (via the "Block all cookies" option)
     * - Server-side rendering
     * - All other non-browser context
     */
    return new MemoryDatabase();
}
let LocalDatabase = class LocalDatabase {
};
LocalDatabase.ɵprov = i0.ɵɵdefineInjectable({ factory: function LocalDatabase_Factory() { return localDatabaseFactory(i0.ɵɵinject(i0.PLATFORM_ID), i0.ɵɵinject(i1.LS_PREFIX), i0.ɵɵinject(i1.IDB_DB_NAME), i0.ɵɵinject(i1.IDB_STORE_NAME), i0.ɵɵinject(i1.IDB_DB_VERSION), i0.ɵɵinject(i1.IDB_NO_WRAP)); }, token: LocalDatabase, providedIn: "root" });
LocalDatabase = __decorate([
    Injectable({
        providedIn: 'root',
        useFactory: localDatabaseFactory,
        deps: [
            PLATFORM_ID,
            LS_PREFIX,
            IDB_DB_NAME,
            IDB_STORE_NAME,
            IDB_DB_VERSION,
            IDB_NO_WRAP,
        ]
    })
], LocalDatabase);
export { LocalDatabase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWwtZGF0YWJhc2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LXB3YS9sb2NhbC1zdG9yYWdlLyIsInNvdXJjZXMiOlsibGliL2RhdGFiYXNlcy9sb2NhbC1kYXRhYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFHcEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDekQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLE1BQU0sV0FBVyxDQUFDOzs7QUFFaEc7Ozs7Ozs7R0FPRztBQUNILE1BQU0sVUFBVSxvQkFBb0IsQ0FDbEMsVUFBa0IsRUFBRSxRQUFnQixFQUFFLFNBQWlCLEVBQUUsWUFBb0IsRUFDN0UsWUFBb0IsRUFBRSxTQUFrQjtJQUV4Qzs7O09BR0c7SUFDSCxJQUFJO1FBRUYscUZBQXFGO1FBQ3JGLElBQUksaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDLEVBQUU7WUFFL0c7Ozs7Ozs7cUhBT3lHO1lBQ3pHLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztTQUVoRjthQUFNLElBQUksaUJBQWlCLENBQUMsVUFBVSxDQUFDO2VBQ3JDLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLFlBQVksQ0FBQyxFQUFFO1lBRXpGOzs7Ozs7Ozs7OztjQVdFO1lBQ0YsT0FBTyxJQUFJLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBRTNDO0tBRUY7SUFBQyxXQUFNLEdBQUU7SUFFVjs7OztPQUlHO0lBQ0gsT0FBTyxJQUFJLGNBQWMsRUFBRSxDQUFDO0FBRTlCLENBQUM7QUFjRCxJQUFzQixhQUFhLEdBQW5DLE1BQXNCLGFBQWE7Q0FXbEMsQ0FBQTs7QUFYcUIsYUFBYTtJQVpsQyxVQUFVLENBQUM7UUFDVixVQUFVLEVBQUUsTUFBTTtRQUNsQixVQUFVLEVBQUUsb0JBQW9CO1FBQ2hDLElBQUksRUFBRTtZQUNKLFdBQVc7WUFDWCxTQUFTO1lBQ1QsV0FBVztZQUNYLGNBQWM7WUFDZCxjQUFjO1lBQ2QsV0FBVztTQUNaO0tBQ0YsQ0FBQztHQUNvQixhQUFhLENBV2xDO1NBWHFCLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJbmRleGVkREJEYXRhYmFzZSB9IGZyb20gJy4vaW5kZXhlZGRiLWRhdGFiYXNlJztcbmltcG9ydCB7IExvY2FsU3RvcmFnZURhdGFiYXNlIH0gZnJvbSAnLi9sb2NhbHN0b3JhZ2UtZGF0YWJhc2UnO1xuaW1wb3J0IHsgTWVtb3J5RGF0YWJhc2UgfSBmcm9tICcuL21lbW9yeS1kYXRhYmFzZSc7XG5pbXBvcnQgeyBJREJfU1RPUkVfTkFNRSwgSURCX0RCX05BTUUsIExTX1BSRUZJWCwgSURCX0RCX1ZFUlNJT04sIElEQl9OT19XUkFQIH0gZnJvbSAnLi4vdG9rZW5zJztcblxuLyoqXG4gKiBGYWN0b3J5IHRvIGNyZWF0ZSBhIHN0b3JhZ2UgYWNjb3JkaW5nIHRvIGJyb3dzZXIgc3VwcG9ydFxuICogQHBhcmFtIHBsYXRmb3JtSWQgQ29udGV4dCBhYm91dCB0aGUgcGxhdGZvcm0gKGBicm93c2VyYCwgYHNlcnZlcmAuLi4pXG4gKiBAcGFyYW0gTFNQcmVmaXggUHJlZml4IGZvciBgbG9jYWxTdG9yYWdlYCBrZXlzIHRvIGF2b2lkIGNvbGxpc2lvbiBmb3IgbXVsdGlwbGUgYXBwcyBvbiB0aGUgc2FtZSBzdWJkb21haW5cbiAqIEBwYXJhbSBJREJEQk5hbWUgYGluZGV4ZWREQmAgZGF0YWJhc2UgbmFtZVxuICogQHBhcmFtIElEQnN0b3JlTmFtZSBgaW5kZXhlZERCYCBzdG9yZU5hbWUgbmFtZVxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2N5cmlsbGV0dXppL2FuZ3VsYXItYXN5bmMtbG9jYWwtc3RvcmFnZS9ibG9iL21hc3Rlci9kb2NzL0JST1dTRVJTX1NVUFBPUlQubWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2NhbERhdGFiYXNlRmFjdG9yeShcbiAgcGxhdGZvcm1JZDogc3RyaW5nLCBMU1ByZWZpeDogc3RyaW5nLCBJREJEQk5hbWU6IHN0cmluZywgSURCU3RvcmVOYW1lOiBzdHJpbmcsXG4gIElEQkRCVmVyc2lvbjogbnVtYmVyLCBJREJOb1dyYXA6IGJvb2xlYW4pOiBMb2NhbERhdGFiYXNlIHtcblxuICAvKiBXaGVuIHN0b3JhZ2UgaXMgZnVsbHkgZGlzYWJsZWQgaW4gYnJvd3NlciAodmlhIHRoZSBcIkJsb2NrIGFsbCBjb29raWVzXCIgb3B0aW9uKSxcbiAgICoganVzdCB0cnlpbmcgdG8gY2hlY2sgYGluZGV4ZWREQmAgb3IgYGxvY2FsU3RvcmFnZWAgdmFyaWFibGVzIGNhdXNlcyBhIHNlY3VyaXR5IGV4Y2VwdGlvbi5cbiAgICogUHJldmVudHMgaHR0cHM6Ly9naXRodWIuY29tL2N5cmlsbGV0dXppL2FuZ3VsYXItYXN5bmMtbG9jYWwtc3RvcmFnZS9pc3N1ZXMvMTE4XG4gICAqL1xuICB0cnkge1xuXG4gICAgLy8gRG8gbm90IGV4cGxpY2l0IGB3aW5kb3dgIGhlcmUsIGFzIHRoZSBnbG9iYWwgb2JqZWN0IGlzIG5vdCB0aGUgc2FtZSBpbiB3ZWIgd29ya2Vyc1xuICAgIGlmIChpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiAoaW5kZXhlZERCICE9PSB1bmRlZmluZWQpICYmIChpbmRleGVkREIgIT09IG51bGwpICYmICgnb3BlbicgaW4gaW5kZXhlZERCKSkge1xuXG4gICAgICAvKiBDaGVjazpcbiAgICAgICogLSBpZiB3ZSBhcmUgaW4gYSBicm93c2VyIGNvbnRleHQgKGlzc3VlOiBzZXJ2ZXItc2lkZSByZW5kZXJpbmcpXG4gICAgICAqIC0gaWYgYGluZGV4ZWREQmAgZXhpc3RzIChpc3N1ZTogSUU5KVxuICAgICAgKiAtIGl0IGNvdWxkIGV4aXN0IGJ1dCBiZSBgdW5kZWZpbmVkYCBvciBgbnVsbGAgKGlzc3VlOiBJRSAvIEVkZ2UgcHJpdmF0ZSBtb2RlKVxuICAgICAgKiAtIGl0IGNvdWxkIGV4aXN0cyBidXQgbm90IGhhdmluZyBhIHdvcmtpbmcgQVBJXG4gICAgICAqIFdpbGwgYmUgdGhlIGNhc2UgZm9yOlxuICAgICAgKiAtIElFMTArIGFuZCBhbGwgb3RoZXIgYnJvd3NlcnMgaW4gbm9ybWFsIG1vZGVcbiAgICAgICogLSBDaHJvbWl1bSAvIFNhZmFyaSBwcml2YXRlIG1vZGUsIGJ1dCBpbiB0aGlzIGNhc2UsIGRhdGEgd2lsbCBiZSBzd2lwZWQgd2hlbiB0aGUgdXNlciBsZWF2ZXMgdGhlIGFwcCAqL1xuICAgICAgcmV0dXJuIG5ldyBJbmRleGVkREJEYXRhYmFzZShJREJEQk5hbWUsIElEQlN0b3JlTmFtZSwgSURCREJWZXJzaW9uLCBJREJOb1dyYXApO1xuXG4gICAgfSBlbHNlIGlmIChpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKVxuICAgICYmIChsb2NhbFN0b3JhZ2UgIT09IHVuZGVmaW5lZCkgJiYgKGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkgJiYgKCdnZXRJdGVtJyBpbiBsb2NhbFN0b3JhZ2UpKSB7XG5cbiAgICAgIC8qIENoZWNrOlxuICAgICAgKiAtIGlmIHdlIGFyZSBpbiBhIGJyb3dzZXIgY29udGV4dCAoaXNzdWU6IHNlcnZlci1zaWRlIHJlbmRlcmluZylcbiAgICAgICogLSBpZiBgbG9jYWxTdG9yYWdlYCBleGlzdHMgKHRvIGJlIHN1cmUpXG4gICAgICAqIC0gaXQgY291bGQgZXhpc3RzIGJ1dCBub3QgaGF2aW5nIGEgd29ya2luZyBBUElcbiAgICAgICogV2lsbCBiZSB0aGUgY2FzZSBmb3I6XG4gICAgICAqIC0gSUU5XG4gICAgICAqIC0gU2FmYXJpIGNyb3NzLW9yaWdpbiBpZnJhbWVzLCBkZXRlY3RlZCBsYXRlciBpbiBgSW5kZXhlZERCRGF0YWJhc2UuY29ubmVjdCgpYFxuICAgICAgKiBAc2VlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vY3lyaWxsZXR1emkvYW5ndWxhci1hc3luYy1sb2NhbC1zdG9yYWdlL2lzc3Vlcy80Mn1cbiAgICAgICogLSBJRSAvIEVkZ2UgLyBGaXJlZm94IHByaXZhdGUgbW9kZSwgYnV0IGluIHRoaXMgY2FzZSwgZGF0YSB3aWxsIGJlIHN3aXBlZCB3aGVuIHRoZSB1c2VyIGxlYXZlcyB0aGUgYXBwXG4gICAgICAqIEZvciBGaXJlZm94LCBjYW4gb25seSBiZSBkZXRlY3RlZCBsYXRlciBpbiBgSW5kZXhlZERCRGF0YWJhc2UuY29ubmVjdCgpYFxuICAgICAgKiBAc2VlIHtAbGluayBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD03ODE5ODJ9XG4gICAgICAqL1xuICAgICAgcmV0dXJuIG5ldyBMb2NhbFN0b3JhZ2VEYXRhYmFzZShMU1ByZWZpeCk7XG5cbiAgICB9XG5cbiAgfSBjYXRjaCB7fVxuXG4gIC8qIFdpbGwgYmUgdGhlIGNhc2UgZm9yOlxuICAgKiAtIEluIGJyb3dzZXJzIGlmIHN0b3JhZ2UgaGFzIGJlZW4gZnVsbHkgZGlzYWJsZWQgKHZpYSB0aGUgXCJCbG9jayBhbGwgY29va2llc1wiIG9wdGlvbilcbiAgICogLSBTZXJ2ZXItc2lkZSByZW5kZXJpbmdcbiAgICogLSBBbGwgb3RoZXIgbm9uLWJyb3dzZXIgY29udGV4dFxuICAgKi9cbiAgcmV0dXJuIG5ldyBNZW1vcnlEYXRhYmFzZSgpO1xuXG59XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICB1c2VGYWN0b3J5OiBsb2NhbERhdGFiYXNlRmFjdG9yeSxcbiAgZGVwczogW1xuICAgIFBMQVRGT1JNX0lELFxuICAgIExTX1BSRUZJWCxcbiAgICBJREJfREJfTkFNRSxcbiAgICBJREJfU1RPUkVfTkFNRSxcbiAgICBJREJfREJfVkVSU0lPTixcbiAgICBJREJfTk9fV1JBUCxcbiAgXVxufSlcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMb2NhbERhdGFiYXNlIHtcblxuICBhYnN0cmFjdCByZWFkb25seSBzaXplOiBPYnNlcnZhYmxlPG51bWJlcj47XG5cbiAgYWJzdHJhY3QgZ2V0PFQgPSB1bmtub3duPihrZXk6IHN0cmluZyk6IE9ic2VydmFibGU8VCB8IHVuZGVmaW5lZD47XG4gIGFic3RyYWN0IHNldChrZXk6IHN0cmluZywgZGF0YTogdW5rbm93bik6IE9ic2VydmFibGU8dW5kZWZpbmVkPjtcbiAgYWJzdHJhY3QgZGVsZXRlKGtleTogc3RyaW5nKTogT2JzZXJ2YWJsZTx1bmRlZmluZWQ+O1xuICBhYnN0cmFjdCBjbGVhcigpOiBPYnNlcnZhYmxlPHVuZGVmaW5lZD47XG4gIGFic3RyYWN0IGtleXMoKTogT2JzZXJ2YWJsZTxzdHJpbmc+O1xuICBhYnN0cmFjdCBoYXMoa2V5OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuXG59XG4iXX0=