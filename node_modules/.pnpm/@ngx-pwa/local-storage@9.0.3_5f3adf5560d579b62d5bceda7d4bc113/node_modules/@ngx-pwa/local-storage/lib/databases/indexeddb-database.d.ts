import { Observable, ReplaySubject } from 'rxjs';
import { LocalDatabase } from './local-database';
export declare class IndexedDBDatabase implements LocalDatabase {
    /**
     * `indexedDB` database name
     */
    protected readonly dbName: string;
    /**
     * `indexedDB` object store name
     */
    protected readonly storeName: string;
    /**
     * `indexedDB` database version. Must be an unsigned **integer**
     */
    protected readonly dbVersion: number;
    /**
     * `indexedDB` database connection, wrapped in a RxJS `ReplaySubject` to be able to access the connection
     * even after the connection success event happened
     */
    protected readonly database: ReplaySubject<IDBDatabase>;
    /**
     * Flag to not wrap `indexedDB` values for interoperability or to wrap for backward compatibility.
     */
    protected readonly noWrap: boolean;
    /**
     * Index used when wrapping value. *For backward compatibility only.*
     */
    protected readonly wrapIndex = "value";
    /**
     * Constructor params are provided by Angular (but can also be passed manually in tests)
     * @param dbName `indexedDB` database name
     * @param storeName `indexedDB` store name
     * @param dbVersion `indexedDB` database version
     * @param noWrap Flag to not wrap `indexedDB` values for interoperability or to wrap for backward compatibility
     */
    constructor(dbName?: string, storeName?: string, dbVersion?: number, noWrap?: boolean);
    /**
     * Information about `indexedDB` connection. *Only useful for interoperability.*
     * @returns `indexedDB` database name, store name and database version
     */
    get backingStore(): {
        database: string;
        store: string;
        version: number;
    };
    /**
     * Number of items in our `indexedDB` database and object store
     */
    get size(): Observable<number>;
    /**
     * Gets an item value in our `indexedDB` store
     * @param key The item's key
     * @returns The item's value if the key exists, `undefined` otherwise, wrapped in an RxJS `Observable`
     */
    get<T = unknown>(key: string): Observable<T | undefined>;
    /**
     * Sets an item in our `indexedDB` store
     * @param key The item's key
     * @param data The item's value
     * @returns An RxJS `Observable` to wait the end of the operation
     */
    set(key: string, data: unknown): Observable<undefined>;
    /**
     * Deletes an item in our `indexedDB` store
     * @param key The item's key
     * @returns An RxJS `Observable` to wait the end of the operation
     */
    delete(key: string): Observable<undefined>;
    /**
     * Deletes all items from our `indexedDB` objet store
     * @returns An RxJS `Observable` to wait the end of the operation
     */
    clear(): Observable<undefined>;
    /**
     * Get all the keys in our `indexedDB` store
     * @returns An RxJS `Observable` iterating on each key
     */
    keys(): Observable<string>;
    /**
     * Check if a key exists in our `indexedDB` store
     * @returns An RxJS `Observable` telling if the key exists or not
     */
    has(key: string): Observable<boolean>;
    /**
     * Connects to `indexedDB` and creates the object store on first time
     */
    protected connect(): void;
    /**
     * Create store on first use of `indexedDB`
     * @param request `indexedDB` database opening request
     */
    protected createStore(request: IDBOpenDBRequest): void;
    /**
     * Open an `indexedDB` transaction and get our store
     * @param mode `readonly` or `readwrite`
     * @returns An `indexedDB` transaction store and events, wrapped in an RxJS `Observable`
     */
    protected transaction(mode: IDBTransactionMode): Observable<{
        store: IDBObjectStore;
        events: Observable<Event>;
    }>;
    /**
     * Listen errors on a transaction or request, and throw if trigerred
     * @param transactionOrRequest `indexedDb` transaction or request to listen
     * @returns An `Observable` listening to errors
     */
    protected listenError(transactionOrRequest: IDBTransaction | IDBRequest): Observable<never>;
    /**
     * Listen transaction `complete` and `error` events
     * @param transaction Transaction to listen
     * @returns An `Observable` listening to transaction `complete` and `error` events
     */
    protected listenTransactionEvents(transaction: IDBTransaction): Observable<Event>;
}
