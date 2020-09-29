import { InjectionToken } from '@angular/core';
/**
 * Token to provide a prefix to `localStorage` keys.
 */
export declare const LS_PREFIX: InjectionToken<string>;
/**
 * Default name used for `indexedDB` database.
 */
export declare const DEFAULT_IDB_DB_NAME = "ngStorage";
/**
 * Token to provide `indexedDB` database name.
 */
export declare const IDB_DB_NAME: InjectionToken<string>;
/**
 * Default version used for `indexedDB` database.
 */
export declare const DEFAULT_IDB_DB_VERSION = 1;
/**
 * Token to provide `indexedDB` database version.
 * Must be an unsigned **integer**.
 */
export declare const IDB_DB_VERSION: InjectionToken<number>;
/**
 * Default name used for `indexedDB` object store.
 */
export declare const DEFAULT_IDB_STORE_NAME = "localStorage";
/**
 * Token to provide `indexedDB` store name.
 * For backward compatibility, the default can't be set now, `IndexedDBDatabase` will do it at runtime.
 */
export declare const IDB_STORE_NAME: InjectionToken<string>;
/**
 * Default value for interoperability with native `indexedDB` and other storage libs,
 * by changing how values are stored in `indexedDB` database.
 */
export declare const DEFAULT_IDB_NO_WRAP = true;
/**
 * Token to allow interoperability with native `indexedDB` and other storage libs,
 * by changing how values are stored in `indexedDB` database.
 * Defaults to `true`. Change to `false` for backward compatiblity in existing applications.
 * **DO NOT CHANGE THIS BEHAVIOR ONCE IN PRODUCTION**, as it would break with existing data.
 */
export declare const IDB_NO_WRAP: InjectionToken<boolean>;
export interface StorageConfig {
    /**
     * Allows to add a prefix before `localStorage` keys.
     * *Use only* for interoperability with other APIs or to avoid collision for multiple apps on the same subdomain.
     * **WARNING: do not change this option in an app already deployed in production, as previously stored data would be lost.**
     */
    LSPrefix?: string;
    /**
     * Allows to change the name used for `indexedDB` database.
     * *Use only* for interoperability with other APIs or to avoid collision for multiple apps on the same subdomain.
     * **WARNING: do not change this option in an app already deployed in production, as previously stored data would be lost.**
     */
    IDBDBName?: string;
    /**
     * Allows to change the name used for `indexedDB` object store.
     * *Use only* for interoperability with other APIs.
     * **WARNING: do not change this option in an app already deployed in production, as previously stored data would be lost.**
     */
    IDBStoreName?: string;
    /**
     * Allows to change the database version used for `indexedDB` database.
     * Must be an unsigned **integer**.
     * **Use with caution as the creation of the store depends on the version.**
     * *Use only* for interoperability with other APIs or to avoid collision for multiple apps on the same subdomain.
     * **WARNING: do not change this option in an app already deployed in production, as previously stored data would be lost.**
     */
    IDBDBVersion?: number;
    /**
     * Allows interoperability with native `indexedDB` and other storage libs,
     * by changing how values are stored in `indexedDB` database.
     * Defaults to `true`. Change to `false` for backward compatiblity in existing applications.
     * **DO NOT CHANGE THIS BEHAVIOR ONCE IN PRODUCTION**, as it would break with existing data.
     */
    IDBNoWrap?: boolean;
}
