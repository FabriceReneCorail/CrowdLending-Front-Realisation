import { Observable } from 'rxjs';
import { LocalDatabase } from './local-database';
export declare class LocalStorageDatabase implements LocalDatabase {
    /**
     * Optional user prefix to avoid collision for multiple apps on the same subdomain
     */
    readonly prefix: string;
    /**
     * Constructor params are provided by Angular (but can also be passed manually in tests)
     * @param prefix Prefix option to avoid collision for multiple apps on the same subdomain or for interoperability
     */
    constructor(prefix?: string);
    /**
     * Number of items in `localStorage`
     */
    get size(): Observable<number>;
    /**
     * Gets an item value in `localStorage`
     * @param key The item's key
     * @returns The item's value if the key exists, `undefined` otherwise, wrapped in a RxJS `Observable`
     */
    get<T = unknown>(key: string): Observable<T | undefined>;
    /**
     * Store an item in `localStorage`
     * @param key The item's key
     * @param data The item's value
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    set(key: string, data: unknown): Observable<undefined>;
    /**
     * Deletes an item in `localStorage`
     * @param key The item's key
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    delete(key: string): Observable<undefined>;
    /**
     * Deletes all items in `localStorage`
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    clear(): Observable<undefined>;
    /**
     * Get all keys in `localStorage`
     * Note the order of the keys may be inconsistent in Firefox
     * @returns A RxJS `Observable` iterating on keys
     */
    keys(): Observable<string>;
    /**
     * Check if a key exists in `localStorage`
     * @param key The item's key
     * @returns A RxJS `Observable` telling if the key exists or not
     */
    has(key: string): Observable<boolean>;
    /**
     * Get an unprefixed key
     * @param index Index of the key
     * @returns The unprefixed key name if exists, `null` otherwise
     */
    protected getUnprefixedKey(index: number): string | null;
    /**
     * Add the prefix to a key
     * @param key The key name
     * @returns The prefixed key name
     */
    protected prefixKey(key: string): string;
}
