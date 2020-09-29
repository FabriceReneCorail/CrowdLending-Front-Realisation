import { Observable } from 'rxjs';
import { LocalDatabase } from './local-database';
export declare class MemoryDatabase implements LocalDatabase {
    /**
     * Memory storage
     */
    protected memoryStorage: Map<string, unknown>;
    /**
     * Number of items in memory
     */
    get size(): Observable<number>;
    /**
     * Gets an item value in memory
     * @param key The item's key
     * @returns The item's value if the key exists, `undefined` otherwise, wrapped in a RxJS `Observable`
     */
    get<T = unknown>(key: string): Observable<T | undefined>;
    /**
     * Sets an item in memory
     * @param key The item's key
     * @param data The item's value
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    set(key: string, data: unknown): Observable<undefined>;
    /**
     * Deletes an item in memory
     * @param key The item's key
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    delete(key: string): Observable<undefined>;
    /**
     * Deletes all items in memory
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    clear(): Observable<undefined>;
    /**
     * Get all keys in memory
     * @returns A RxJS `Observable` iterating on keys
     */
    keys(): Observable<string>;
    /**
     * Check if a key exists in memory
     * @param key Key name
     * @returns a RxJS `Observable` telling if the key exists or not
     */
    has(key: string): Observable<boolean>;
}
