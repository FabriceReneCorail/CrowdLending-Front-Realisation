import { Observable } from 'rxjs';
/**
 * Factory to create a storage according to browser support
 * @param platformId Context about the platform (`browser`, `server`...)
 * @param LSPrefix Prefix for `localStorage` keys to avoid collision for multiple apps on the same subdomain
 * @param IDBDBName `indexedDB` database name
 * @param IDBstoreName `indexedDB` storeName name
 * @see {@link https://github.com/cyrilletuzi/angular-async-local-storage/blob/master/docs/BROWSERS_SUPPORT.md}
 */
export declare function localDatabaseFactory(platformId: string, LSPrefix: string, IDBDBName: string, IDBStoreName: string, IDBDBVersion: number, IDBNoWrap: boolean): LocalDatabase;
export declare abstract class LocalDatabase {
    abstract readonly size: Observable<number>;
    abstract get<T = unknown>(key: string): Observable<T | undefined>;
    abstract set(key: string, data: unknown): Observable<undefined>;
    abstract delete(key: string): Observable<undefined>;
    abstract clear(): Observable<undefined>;
    abstract keys(): Observable<string>;
    abstract has(key: string): Observable<boolean>;
}
