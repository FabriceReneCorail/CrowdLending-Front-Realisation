import { Observable } from 'rxjs';
import { StorageMap } from './storage-map.service';
import { JSONSchema, JSONSchemaBoolean, JSONSchemaInteger, JSONSchemaNumber, JSONSchemaString, JSONSchemaArrayOf } from '../validation';
export declare class LocalStorage {
    protected storageMap: StorageMap;
    /**
     * Number of items in storage wrapped in an `Observable`
     *
     * @example
     * this.localStorage.length.subscribe((length) => {
     *   console.log(length);
     * });
     */
    get length(): Observable<number>;
    constructor(storageMap: StorageMap);
    /**
     * Get an item value in storage.
     * The signature has many overloads due to validation, **please refer to the documentation.**
     * @see {@link https://github.com/cyrilletuzi/angular-async-local-storage/blob/master/docs/VALIDATION.md}
     * @param key The item's key
     * @param schema Optional JSON schema to validate the data.
     * **Note you must pass the schema directly as the second argument.**
     * **Passing the schema in an object `{ schema }` is deprecated and only here**
     * **for backward compatibility: it will be removed in a future version.**
     * @returns The item's value if the key exists, `null` otherwise, wrapped in a RxJS `Observable`
     *
     * @example
     * this.localStorage.get('key', { type: 'string' }).subscribe((result) => {
     *   result; // string or null
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
     * this.localStorage.get<User>('user', schema).subscribe((user) => {
     *   if (user) {
     *     user.firstName;
     *   }
     * });
     */
    getItem<T = string>(key: string, schema: JSONSchemaString): Observable<string | null>;
    getItem<T = number>(key: string, schema: JSONSchemaInteger | JSONSchemaNumber): Observable<number | null>;
    getItem<T = boolean>(key: string, schema: JSONSchemaBoolean): Observable<boolean | null>;
    getItem<T = string[]>(key: string, schema: JSONSchemaArrayOf<JSONSchemaString>): Observable<string[] | null>;
    getItem<T = number[]>(key: string, schema: JSONSchemaArrayOf<JSONSchemaInteger | JSONSchemaNumber>): Observable<number[] | null>;
    getItem<T = boolean[]>(key: string, schema: JSONSchemaArrayOf<JSONSchemaBoolean>): Observable<boolean[] | null>;
    getItem<T = unknown>(key: string, schema: JSONSchema | {
        schema: JSONSchema;
    }): Observable<T | null>;
    getItem<T = unknown>(key: string, schema?: JSONSchema): Observable<unknown>;
    /**
     * Set an item in storage.
     * Note that setting `null` or `undefined` will remove the item to avoid some browsers issues.
     * @param key The item's key
     * @param data The item's value
     * @param schema Optional JSON schema to validate the data
     * @returns A RxJS `Observable` to wait the end of the operation
     *
     * @example
     * this.localStorage.set('key', 'value').subscribe(() => {});
     */
    setItem(key: string, data: unknown, schema?: JSONSchema): Observable<boolean>;
    /**
     * Delete an item in storage
     * @param key The item's key
     * @returns A RxJS `Observable` to wait the end of the operation
     *
     * @example
     * this.localStorage.delete('key').subscribe(() => {});
     */
    removeItem(key: string): Observable<boolean>;
    /**
     * Delete all items in storage
     * @returns A RxJS `Observable` to wait the end of the operation
     *
     * @example
     * this.localStorage.clear().subscribe(() => {});
     */
    clear(): Observable<boolean>;
}
