import { Observable, OperatorFunction, ReplaySubject } from 'rxjs';
import { JSONSchema, JSONSchemaBoolean, JSONSchemaInteger, JSONSchemaNumber, JSONSchemaString, JSONSchemaArrayOf, JSONValidator } from '../validation';
import { LocalDatabase } from '../databases';
export declare class StorageMap {
    protected database: LocalDatabase;
    protected jsonValidator: JSONValidator;
    protected LSPrefix: string;
    protected notifiers: Map<string, ReplaySubject<unknown>>;
    /**
     * Constructor params are provided by Angular (but can also be passed manually in tests)
     * @param database Storage to use
     * @param jsonValidator Validator service
     * @param LSPrefix Prefix for `localStorage` keys to avoid collision for multiple apps on the same subdomain or for interoperability
     */
    constructor(database: LocalDatabase, jsonValidator?: JSONValidator, LSPrefix?: string);
    /**
     * **Number of items** in storage, wrapped in an `Observable`.
     *
     * @example
     * this.storageMap.size.subscribe((size) => {
     *   console.log(size);
     * });
     */
    get size(): Observable<number>;
    /**
     * Tells you which storage engine is used. *Only useful for interoperability.*
     * Note that due to some browsers issues in some special contexts
     * (Firefox private mode and Safari cross-origin iframes),
     * **this information may be wrong at initialization,**
     * as the storage could fallback from `indexedDB` to `localStorage`
     * only after a first read or write operation.
     * @returns Storage engine used
     *
     * @see {@link https://github.com/cyrilletuzi/angular-async-local-storage/blob/master/docs/INTEROPERABILITY.md}
     *
     * @example
     * if (this.storageMap.backingEngine === 'indexedDB') {}
     */
    get backingEngine(): 'indexedDB' | 'localStorage' | 'memory' | 'unknown';
    /**
     * Info about `indexedDB` database. *Only useful for interoperability.*
     * @returns `indexedDB` database name, store name and database version.
     * **Values will be empty if the storage is not `indexedDB`,**
     * **so it should be used after an engine check**.
     *
     * @see {@link https://github.com/cyrilletuzi/angular-async-local-storage/blob/master/docs/INTEROPERABILITY.md}
     *
     * @example
     * if (this.storageMap.backingEngine === 'indexedDB') {
     *   const { database, store, version } = this.storageMap.backingStore;
     * }
     */
    get backingStore(): {
        database: string;
        store: string;
        version: number;
    };
    /**
     * Info about `localStorage` fallback storage. *Only useful for interoperability.*
     * @returns `localStorage` prefix.
     * **Values will be empty if the storage is not `localStorage`,**
     * **so it should be used after an engine check**.
     *
     * @see {@link https://github.com/cyrilletuzi/angular-async-local-storage/blob/master/docs/INTEROPERABILITY.md}
     *
     * @example
     * if (this.storageMap.backingEngine === 'localStorage') {
     *   const { prefix } = this.storageMap.fallbackBackingStore;
     * }
     */
    get fallbackBackingStore(): {
        prefix: string;
    };
    /**
     * Get an item value in storage.
     * The signature has many overloads due to validation, **please refer to the documentation.**
     * @see {@link https://github.com/cyrilletuzi/angular-async-local-storage/blob/master/docs/VALIDATION.md}
     * @param key The item's key
     * @param schema Optional JSON schema to validate the data
     * @returns The item's value if the key exists, `undefined` otherwise, wrapped in a RxJS `Observable`
     *
     * @example
     * this.storageMap.get('key', { type: 'string' }).subscribe((result) => {
     *   result; // string or undefined
     * });
     *
     * @example
     * interface User {
     *   firstName: string;
     *   lastName?: string;
     * }
     *
     * const schema = {
     *   type: 'object',
     *   properties: {
     *     firstName: { type: 'string' },
     *     lastName: { type: 'string' },
     *   },
     *   required: ['firstName']
     * };
     *
     * this.storageMap.get<User>('user', schema).subscribe((user) => {
     *   if (user) {
     *     user.firstName;
     *   }
     * });
     */
    get<T = string>(key: string, schema: JSONSchemaString): Observable<string | undefined>;
    get<T = number>(key: string, schema: JSONSchemaInteger | JSONSchemaNumber): Observable<number | undefined>;
    get<T = boolean>(key: string, schema: JSONSchemaBoolean): Observable<boolean | undefined>;
    get<T = string[]>(key: string, schema: JSONSchemaArrayOf<JSONSchemaString>): Observable<string[] | undefined>;
    get<T = number[]>(key: string, schema: JSONSchemaArrayOf<JSONSchemaInteger | JSONSchemaNumber>): Observable<number[] | undefined>;
    get<T = boolean[]>(key: string, schema: JSONSchemaArrayOf<JSONSchemaBoolean>): Observable<boolean[] | undefined>;
    get<T = unknown>(key: string, schema: JSONSchema): Observable<T | undefined>;
    get<T = unknown>(key: string, schema?: JSONSchema): Observable<unknown>;
    /**
     * Set an item in storage.
     * Note that setting `null` or `undefined` will remove the item to avoid some browsers issues.
     * @param key The item's key
     * @param data The item's value
     * @param schema Optional JSON schema to validate the data
     * @returns A RxJS `Observable` to wait the end of the operation
     *
     * @example
     * this.storageMap.set('key', 'value').subscribe(() => {});
     */
    set(key: string, data: unknown, schema?: JSONSchema): Observable<undefined>;
    /**
     * Delete an item in storage
     * @param key The item's key
     * @returns A RxJS `Observable` to wait the end of the operation
     *
     * @example
     * this.storageMap.delete('key').subscribe(() => {});
     */
    delete(key: string): Observable<undefined>;
    /**
     * Delete all items in storage
     * @returns A RxJS `Observable` to wait the end of the operation
     *
     * @example
     * this.storageMap.clear().subscribe(() => {});
     */
    clear(): Observable<undefined>;
    /**
     * Get all keys stored in storage. Note **this is an *iterating* `Observable`**:
     * * if there is no key, the `next` callback will not be invoked,
     * * if you need to wait the whole operation to end, be sure to act in the `complete` callback,
     * as this `Observable` can emit several values and so will invoke the `next` callback several times.
     * @returns A list of the keys wrapped in a RxJS `Observable`
     *
     * @example
     * this.storageMap.keys().subscribe({
     *   next: (key) => { console.log(key); },
     *   complete: () => { console.log('Done'); },
     * });
     */
    keys(): Observable<string>;
    /**
     * Tells if a key exists in storage
     * @returns A RxJS `Observable` telling if the key exists
     *
     * @example
     * this.storageMap.has('key').subscribe((hasKey) => {
     *   if (hasKey) {}
     * });
     */
    has(key: string): Observable<boolean>;
    /**
     * Watch an item value in storage.
     * **Note only changes done via this lib will be watched**, external changes in storage can't be detected.
     * The signature has many overloads due to validation, **please refer to the documentation.**
     * @see https://github.com/cyrilletuzi/angular-async-local-storage/blob/master/docs/VALIDATION.md
     * @param key The item's key to watch
     * @param schema Optional JSON schema to validate the initial value
     * @returns An infinite `Observable` giving the current value
     */
    watch<T = string>(key: string, schema: JSONSchemaString): Observable<string | undefined>;
    watch<T = number>(key: string, schema: JSONSchemaInteger | JSONSchemaNumber): Observable<number | undefined>;
    watch<T = boolean>(key: string, schema: JSONSchemaBoolean): Observable<boolean | undefined>;
    watch<T = string[]>(key: string, schema: JSONSchemaArrayOf<JSONSchemaString>): Observable<string[] | undefined>;
    watch<T = number[]>(key: string, schema: JSONSchemaArrayOf<JSONSchemaInteger | JSONSchemaNumber>): Observable<number[] | undefined>;
    watch<T = boolean[]>(key: string, schema: JSONSchemaArrayOf<JSONSchemaBoolean>): Observable<boolean[] | undefined>;
    watch<T = unknown>(key: string, schema: JSONSchema): Observable<T | undefined>;
    watch<T = unknown>(key: string, schema?: JSONSchema): Observable<unknown>;
    /**
     * Notify when a value changes
     * @param key The item's key
     * @param data The new value
     */
    protected notify(key: string, value: unknown): void;
    /**
     * RxJS operator to catch if `indexedDB` is broken
     * @param operationCallback Callback with the operation to redo
     */
    protected catchIDBBroken<T>(operationCallback: () => Observable<T>): OperatorFunction<T, T>;
}
