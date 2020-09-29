import { __extends, __decorate, __param, __values } from 'tslib';
import { InjectionToken, Inject, ɵɵdefineInjectable, ɵɵinject, Injectable, PLATFORM_ID, NgModule } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReplaySubject, fromEvent, race, throwError, of, Observable, asyncScheduler, from } from 'rxjs';
import { mergeMap, map, first, mapTo, takeWhile, tap, observeOn, catchError } from 'rxjs/operators';

/**
 * Exception message when `indexedDB` is not working
 */
var IDB_BROKEN_ERROR = 'indexedDB is not working';
/**
 * Exception raised when `indexedDB` is not working
 */
var IDBBrokenError = /** @class */ (function (_super) {
    __extends(IDBBrokenError, _super);
    function IDBBrokenError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.message = IDB_BROKEN_ERROR;
        return _this;
    }
    return IDBBrokenError;
}(Error));
/**
 * Exception message when a value can't be serialized for `localStorage`
 */
var SERIALIZATION_ERROR = "The storage is currently localStorage,\nwhere data must be serialized, and the provided data can't be serialized.";
/**
 * Exception raised when a value can't be serialized for `localStorage`
 */
var SerializationError = /** @class */ (function (_super) {
    __extends(SerializationError, _super);
    function SerializationError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.message = SERIALIZATION_ERROR;
        return _this;
    }
    return SerializationError;
}(Error));

/**
 * Token to provide a prefix to `localStorage` keys.
 */
var LS_PREFIX = new InjectionToken('localStoragePrefix', {
    providedIn: 'root',
    factory: function () { return ''; }
});
/**
 * Default name used for `indexedDB` database.
 */
var DEFAULT_IDB_DB_NAME = 'ngStorage';
/**
 * Token to provide `indexedDB` database name.
 */
var IDB_DB_NAME = new InjectionToken('localStorageIDBDBName', {
    providedIn: 'root',
    factory: function () { return DEFAULT_IDB_DB_NAME; }
});
/**
 * Default version used for `indexedDB` database.
 */
var DEFAULT_IDB_DB_VERSION = 1;
/**
 * Token to provide `indexedDB` database version.
 * Must be an unsigned **integer**.
 */
var IDB_DB_VERSION = new InjectionToken('localStorageIDBDBVersion', {
    providedIn: 'root',
    factory: function () { return DEFAULT_IDB_DB_VERSION; }
});
/**
 * Default name used for `indexedDB` object store.
 */
var DEFAULT_IDB_STORE_NAME = 'localStorage';
/**
 * Token to provide `indexedDB` store name.
 * For backward compatibility, the default can't be set now, `IndexedDBDatabase` will do it at runtime.
 */
var IDB_STORE_NAME = new InjectionToken('localStorageIDBStoreName', {
    providedIn: 'root',
    factory: function () { return DEFAULT_IDB_STORE_NAME; }
});
/**
 * Default value for interoperability with native `indexedDB` and other storage libs,
 * by changing how values are stored in `indexedDB` database.
 */
var DEFAULT_IDB_NO_WRAP = true;
/**
 * Token to allow interoperability with native `indexedDB` and other storage libs,
 * by changing how values are stored in `indexedDB` database.
 * Defaults to `true`. Change to `false` for backward compatiblity in existing applications.
 * **DO NOT CHANGE THIS BEHAVIOR ONCE IN PRODUCTION**, as it would break with existing data.
 */
var IDB_NO_WRAP = new InjectionToken('localStorageIDBWrap', {
    providedIn: 'root',
    factory: function () { return DEFAULT_IDB_NO_WRAP; }
});

var IndexedDBDatabase = /** @class */ (function () {
    /**
     * Constructor params are provided by Angular (but can also be passed manually in tests)
     * @param dbName `indexedDB` database name
     * @param storeName `indexedDB` store name
     * @param dbVersion `indexedDB` database version
     * @param noWrap Flag to not wrap `indexedDB` values for interoperability or to wrap for backward compatibility
     */
    function IndexedDBDatabase(dbName, storeName, dbVersion, noWrap) {
        if (dbName === void 0) { dbName = DEFAULT_IDB_DB_NAME; }
        if (storeName === void 0) { storeName = DEFAULT_IDB_STORE_NAME; }
        if (dbVersion === void 0) { dbVersion = DEFAULT_IDB_DB_VERSION; }
        if (noWrap === void 0) { noWrap = DEFAULT_IDB_NO_WRAP; }
        /**
         * `indexedDB` database connection, wrapped in a RxJS `ReplaySubject` to be able to access the connection
         * even after the connection success event happened
         */
        this.database = new ReplaySubject(1);
        /**
         * Index used when wrapping value. *For backward compatibility only.*
         */
        this.wrapIndex = 'value';
        this.dbName = dbName;
        this.storeName = storeName;
        this.dbVersion = dbVersion;
        this.noWrap = noWrap;
        /* Connect to `indexedDB`, with prefix if provided by the user */
        this.connect();
    }
    Object.defineProperty(IndexedDBDatabase.prototype, "backingStore", {
        /**
         * Information about `indexedDB` connection. *Only useful for interoperability.*
         * @returns `indexedDB` database name, store name and database version
         */
        get: function () {
            return {
                database: this.dbName,
                store: this.storeName,
                version: this.dbVersion,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexedDBDatabase.prototype, "size", {
        /**
         * Number of items in our `indexedDB` database and object store
         */
        get: function () {
            /* Open a transaction in read-only mode */
            return this.transaction('readonly').pipe(mergeMap(function (transactionData) {
                var store = transactionData.store, events = transactionData.events;
                /* Request to know the number of items */
                var request = store.count();
                /* Return the result */
                return events.pipe(map(function () { return request.result; }));
            }), 
            /* The observable will complete after the first value */
            first());
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets an item value in our `indexedDB` store
     * @param key The item's key
     * @returns The item's value if the key exists, `undefined` otherwise, wrapped in an RxJS `Observable`
     */
    IndexedDBDatabase.prototype.get = function (key) {
        var _this = this;
        /* Open a transaction in read-only mode */
        return this.transaction('readonly').pipe(mergeMap(function (transactionData) {
            var store = transactionData.store, events = transactionData.events;
            /* Request the value with the key provided by the user */
            var request = store.get(key);
            /* Listen events and return the result */
            return events.pipe(map(function () {
                if ((request.result !== undefined) && (request.result !== null)) {
                    /* Prior to v8, the value was wrapped in an `{ value: ...}` object */
                    if (!_this.noWrap && (typeof request.result === 'object') && (_this.wrapIndex in request.result) &&
                        (request.result[_this.wrapIndex] !== undefined) && (request.result[_this.wrapIndex] !== null)) {
                        return request.result[_this.wrapIndex];
                    }
                    else {
                        /* Cast to the wanted type */
                        return request.result;
                    }
                }
                /* Return `undefined` if the value is empty */
                return undefined;
            }));
        }), 
        /* The observable will complete after the first value */
        first());
    };
    /**
     * Sets an item in our `indexedDB` store
     * @param key The item's key
     * @param data The item's value
     * @returns An RxJS `Observable` to wait the end of the operation
     */
    IndexedDBDatabase.prototype.set = function (key, data) {
        var _this = this;
        /* Storing `undefined` in `indexedDb` can cause issues in some browsers so removing item instead */
        if (data === undefined) {
            return this.delete(key);
        }
        /* Open a transaction in write mode */
        return this.transaction('readwrite').pipe(mergeMap(function (transactionData) {
            var _a;
            var store = transactionData.store, events = transactionData.events;
            /* Prior to v8, data was wrapped in a `{ value: ... }` object */
            var dataToStore = _this.noWrap ? data : (_a = {}, _a[_this.wrapIndex] = data, _a);
            /* Add if the item is not existing yet, or update otherwise */
            store.put(dataToStore, key);
            /* Listen to events and return `undefined` as no value is expected */
            return events.pipe(mapTo(undefined));
        }), 
        /* The observable will complete after the first value */
        first());
    };
    /**
     * Deletes an item in our `indexedDB` store
     * @param key The item's key
     * @returns An RxJS `Observable` to wait the end of the operation
     */
    IndexedDBDatabase.prototype.delete = function (key) {
        /* Open a transaction in write mode */
        return this.transaction('readwrite').pipe(mergeMap(function (transactionData) {
            var store = transactionData.store, events = transactionData.events;
            /* Delete the item in store */
            store.delete(key);
            /* Listen to events and return `undefined` as no data is expected here */
            return events.pipe(mapTo(undefined));
        }), 
        /* The observable will complete after the first value */
        first());
    };
    /**
     * Deletes all items from our `indexedDB` objet store
     * @returns An RxJS `Observable` to wait the end of the operation
     */
    IndexedDBDatabase.prototype.clear = function () {
        /* Open a transaction in write mode */
        return this.transaction('readwrite').pipe(mergeMap(function (transactionData) {
            var store = transactionData.store, events = transactionData.events;
            /* Delete all items in object store */
            store.clear();
            /* Listen to events and return `undefined` as no data is expected here */
            return events.pipe(mapTo(undefined));
        }), 
        /* The observable will complete */
        first());
    };
    /**
     * Get all the keys in our `indexedDB` store
     * @returns An RxJS `Observable` iterating on each key
     */
    IndexedDBDatabase.prototype.keys = function () {
        var _this = this;
        /* Open a transaction in read-only mode */
        return this.transaction('readonly').pipe(
        /* `first()` is used as the final operator in other methods to complete the `Observable`
         * (as it all starts from a `ReplaySubject` which never ends),
         * but as this method is iterating over multiple values, `first()` **must** be used here */
        first(), mergeMap(function (transactionData) {
            var store = transactionData.store;
            /* Open a cursor on the store
             * `.openKeyCursor()` is better for performance, but only available in indexedDB v2 (missing in IE/Edge)
             * Avoid issues like https://github.com/cyrilletuzi/angular-async-local-storage/issues/69 */
            var request = ('openKeyCursor' in store) ? store.openKeyCursor() : store.openCursor();
            /* Listen to success event */
            var success$ = fromEvent(request, 'success').pipe(
            /* Stop the `Observable` when the cursor is `null` */
            takeWhile(function () { return (request.result !== null); }), 
            /* This lib only allows string keys, but user could have added other types of keys from outside
             * It's OK to cast as the cursor as been tested in the previous operator */
            map(function () { return request.result.key.toString(); }), 
            /* Iterate on the cursor */
            tap(function () { request.result.continue(); }));
            /* Listen to error event and if so, throw an error */
            var error$ = _this.listenError(request);
            /* Choose the first event to occur */
            return race([success$, error$]);
        }));
    };
    /**
     * Check if a key exists in our `indexedDB` store
     * @returns An RxJS `Observable` telling if the key exists or not
     */
    IndexedDBDatabase.prototype.has = function (key) {
        /* Open a transaction in read-only mode */
        return this.transaction('readonly').pipe(mergeMap(function (transactionData) {
            var store = transactionData.store, events = transactionData.events;
            /* Check if the key exists in the store
             * `getKey()` is better but only available in `indexedDB` v2 (Chrome >= 58, missing in IE/Edge).
             * In older browsers, the value is checked instead, but it could lead to an exception
             * if `undefined` was stored outside of this lib (e.g. directly with the native `indexedDB` API).
             * Fixes https://github.com/cyrilletuzi/angular-async-local-storage/issues/69
             */
            var request = ('getKey' in store) ? store.getKey(key) : store.get(key);
            /* Listen to events and return `true` or `false` */
            return events.pipe(map(function () { return (request.result !== undefined) ? true : false; }));
        }), 
        /* The observable will complete */
        first());
    };
    /**
     * Connects to `indexedDB` and creates the object store on first time
     */
    IndexedDBDatabase.prototype.connect = function () {
        var _this = this;
        var request;
        /* Connect to `indexedDB`
         * Will fail in Safari cross-origin iframes
         * @see {@link https://github.com/cyrilletuzi/angular-async-local-storage/issues/42} */
        try {
            /* Do NOT explicit `window` here, as `indexedDB` could be used from a web worker too */
            request = indexedDB.open(this.dbName, this.dbVersion);
        }
        catch (_a) {
            this.database.error(new IDBBrokenError());
            return;
        }
        /* Create store on first connection */
        this.createStore(request);
        /* Listen to success and error events */
        var success$ = fromEvent(request, 'success');
        var error$ = this.listenError(request);
        /* Choose the first to occur */
        race([success$, error$])
            /* The observable will complete */
            .pipe(first())
            .subscribe({
            next: function () {
                /* Register the database connection in the `ReplaySubject` for further access */
                _this.database.next(request.result);
            },
            error: function () {
                /* Firefox private mode issue: fallback storage if IndexedDb connection is failing
                * @see {@link https://bugzilla.mozilla.org/show_bug.cgi?id=781982}
                * @see {@link https://github.com/cyrilletuzi/angular-async-local-storage/issues/26} */
                _this.database.error(new IDBBrokenError());
            },
        });
    };
    /**
     * Create store on first use of `indexedDB`
     * @param request `indexedDB` database opening request
     */
    IndexedDBDatabase.prototype.createStore = function (request) {
        var _this = this;
        /* Listen to the event fired on first connection */
        fromEvent(request, 'upgradeneeded')
            /* The observable will complete */
            .pipe(first())
            .subscribe({
            next: function () {
                /* Check if the store already exists, to avoid error */
                if (!request.result.objectStoreNames.contains(_this.storeName)) {
                    /* Create the object store */
                    request.result.createObjectStore(_this.storeName);
                }
            }
        });
    };
    /**
     * Open an `indexedDB` transaction and get our store
     * @param mode `readonly` or `readwrite`
     * @returns An `indexedDB` transaction store and events, wrapped in an RxJS `Observable`
     */
    IndexedDBDatabase.prototype.transaction = function (mode) {
        var _this = this;
        /* From the `indexedDB` connection, open a transaction and get the store */
        return this.database
            .pipe(mergeMap(function (database) {
            var transaction;
            try {
                transaction = database.transaction([_this.storeName], mode);
            }
            catch (error) {
                /* The store could have been deleted from outside */
                return throwError(error);
            }
            /* Get the store from the transaction */
            var store = transaction.objectStore(_this.storeName);
            /* Listen transaction `complete` and `error` events */
            var events = _this.listenTransactionEvents(transaction);
            return of({ store: store, events: events });
        }));
    };
    /**
     * Listen errors on a transaction or request, and throw if trigerred
     * @param transactionOrRequest `indexedDb` transaction or request to listen
     * @returns An `Observable` listening to errors
     */
    IndexedDBDatabase.prototype.listenError = function (transactionOrRequest) {
        return fromEvent(transactionOrRequest, 'error').pipe(
        /* Throw on error to be able to catch errors in RxJS way */
        mergeMap(function () { return throwError(transactionOrRequest.error); }));
    };
    /**
     * Listen transaction `complete` and `error` events
     * @param transaction Transaction to listen
     * @returns An `Observable` listening to transaction `complete` and `error` events
     */
    IndexedDBDatabase.prototype.listenTransactionEvents = function (transaction) {
        /* Listen to the `complete` event */
        var complete$ = fromEvent(transaction, 'complete');
        /* Listen to the `error` event */
        var error$ = this.listenError(transaction);
        /* Choose the first event to occur */
        return race([complete$, error$]);
    };
    IndexedDBDatabase.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [IDB_DB_NAME,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [IDB_STORE_NAME,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [IDB_DB_VERSION,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [IDB_NO_WRAP,] }] }
    ]; };
    IndexedDBDatabase.ɵprov = ɵɵdefineInjectable({ factory: function IndexedDBDatabase_Factory() { return new IndexedDBDatabase(ɵɵinject(IDB_DB_NAME), ɵɵinject(IDB_STORE_NAME), ɵɵinject(IDB_DB_VERSION), ɵɵinject(IDB_NO_WRAP)); }, token: IndexedDBDatabase, providedIn: "root" });
    IndexedDBDatabase = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __param(0, Inject(IDB_DB_NAME)),
        __param(1, Inject(IDB_STORE_NAME)),
        __param(2, Inject(IDB_DB_VERSION)),
        __param(3, Inject(IDB_NO_WRAP))
    ], IndexedDBDatabase);
    return IndexedDBDatabase;
}());

var LocalStorageDatabase = /** @class */ (function () {
    /**
     * Constructor params are provided by Angular (but can also be passed manually in tests)
     * @param prefix Prefix option to avoid collision for multiple apps on the same subdomain or for interoperability
     */
    function LocalStorageDatabase(prefix) {
        if (prefix === void 0) { prefix = ''; }
        /* Prefix if asked, or no prefix otherwise */
        this.prefix = prefix || '';
    }
    Object.defineProperty(LocalStorageDatabase.prototype, "size", {
        /**
         * Number of items in `localStorage`
         */
        get: function () {
            /* Wrap in a RxJS `Observable` to be consistent with other storages */
            return of(localStorage.length);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets an item value in `localStorage`
     * @param key The item's key
     * @returns The item's value if the key exists, `undefined` otherwise, wrapped in a RxJS `Observable`
     */
    LocalStorageDatabase.prototype.get = function (key) {
        /* Get raw data */
        var unparsedData = localStorage.getItem(this.prefixKey(key));
        var parsedData;
        /* No need to parse if data is `null` or `undefined` */
        if ((unparsedData !== undefined) && (unparsedData !== null)) {
            /* Try to parse */
            try {
                parsedData = JSON.parse(unparsedData);
            }
            catch (error) {
                return throwError(error);
            }
        }
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(parsedData);
    };
    /**
     * Store an item in `localStorage`
     * @param key The item's key
     * @param data The item's value
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    LocalStorageDatabase.prototype.set = function (key, data) {
        var serializedData = null;
        /* Check if data can be serialized */
        var dataPrototype = Object.getPrototypeOf(data);
        if ((typeof data === 'object') && (data !== null) && !Array.isArray(data) &&
            !((dataPrototype === Object.prototype) || (dataPrototype === null))) {
            return throwError(new SerializationError());
        }
        /* Try to stringify (can fail on circular references) */
        try {
            serializedData = JSON.stringify(data);
        }
        catch (error) {
            return throwError(error);
        }
        /* Can fail if storage quota is exceeded */
        try {
            localStorage.setItem(this.prefixKey(key), serializedData);
        }
        catch (error) {
            return throwError(error);
        }
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(undefined);
    };
    /**
     * Deletes an item in `localStorage`
     * @param key The item's key
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    LocalStorageDatabase.prototype.delete = function (key) {
        localStorage.removeItem(this.prefixKey(key));
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(undefined);
    };
    /**
     * Deletes all items in `localStorage`
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    LocalStorageDatabase.prototype.clear = function () {
        localStorage.clear();
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(undefined);
    };
    /**
     * Get all keys in `localStorage`
     * Note the order of the keys may be inconsistent in Firefox
     * @returns A RxJS `Observable` iterating on keys
     */
    LocalStorageDatabase.prototype.keys = function () {
        var _this = this;
        /* Create an `Observable` from keys */
        return new Observable(function (subscriber) {
            /* Iteretate over all the indexes */
            for (var index = 0; index < localStorage.length; index += 1) {
                /* Cast as we are sure in this case the key is not `null` */
                subscriber.next(_this.getUnprefixedKey(index));
            }
            subscriber.complete();
        }).pipe(
        /* Required to work like other databases which are asynchronous */
        observeOn(asyncScheduler));
    };
    /**
     * Check if a key exists in `localStorage`
     * @param key The item's key
     * @returns A RxJS `Observable` telling if the key exists or not
     */
    LocalStorageDatabase.prototype.has = function (key) {
        /* Itérate over all indexes in storage */
        for (var index = 0; index < localStorage.length; index += 1) {
            if (key === this.getUnprefixedKey(index)) {
                /* Wrap in a RxJS `Observable` to be consistent with other storages */
                return of(true);
            }
        }
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(false);
    };
    /**
     * Get an unprefixed key
     * @param index Index of the key
     * @returns The unprefixed key name if exists, `null` otherwise
     */
    LocalStorageDatabase.prototype.getUnprefixedKey = function (index) {
        /* Get the key in storage: may have a prefix */
        var prefixedKey = localStorage.key(index);
        if (prefixedKey !== null) {
            /* If no prefix, the key is already good, otherwrite strip the prefix */
            return !this.prefix ? prefixedKey : prefixedKey.substr(this.prefix.length);
        }
        return null;
    };
    /**
     * Add the prefix to a key
     * @param key The key name
     * @returns The prefixed key name
     */
    LocalStorageDatabase.prototype.prefixKey = function (key) {
        return "" + this.prefix + key;
    };
    LocalStorageDatabase.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [LS_PREFIX,] }] }
    ]; };
    LocalStorageDatabase.ɵprov = ɵɵdefineInjectable({ factory: function LocalStorageDatabase_Factory() { return new LocalStorageDatabase(ɵɵinject(LS_PREFIX)); }, token: LocalStorageDatabase, providedIn: "root" });
    LocalStorageDatabase = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __param(0, Inject(LS_PREFIX))
    ], LocalStorageDatabase);
    return LocalStorageDatabase;
}());

var MemoryDatabase = /** @class */ (function () {
    function MemoryDatabase() {
        /**
         * Memory storage
         */
        this.memoryStorage = new Map();
    }
    Object.defineProperty(MemoryDatabase.prototype, "size", {
        /**
         * Number of items in memory
         */
        get: function () {
            /* Wrap in a RxJS `Observable` to be consistent with other storages */
            return of(this.memoryStorage.size);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets an item value in memory
     * @param key The item's key
     * @returns The item's value if the key exists, `undefined` otherwise, wrapped in a RxJS `Observable`
     */
    MemoryDatabase.prototype.get = function (key) {
        var rawData = this.memoryStorage.get(key);
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(rawData);
    };
    /**
     * Sets an item in memory
     * @param key The item's key
     * @param data The item's value
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    MemoryDatabase.prototype.set = function (key, data) {
        this.memoryStorage.set(key, data);
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(undefined);
    };
    /**
     * Deletes an item in memory
     * @param key The item's key
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    MemoryDatabase.prototype.delete = function (key) {
        this.memoryStorage.delete(key);
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(undefined);
    };
    /**
     * Deletes all items in memory
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    MemoryDatabase.prototype.clear = function () {
        this.memoryStorage.clear();
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(undefined);
    };
    /**
     * Get all keys in memory
     * @returns A RxJS `Observable` iterating on keys
     */
    MemoryDatabase.prototype.keys = function () {
        /* Create an `Observable` from keys */
        return from(this.memoryStorage.keys());
    };
    /**
     * Check if a key exists in memory
     * @param key Key name
     * @returns a RxJS `Observable` telling if the key exists or not
     */
    MemoryDatabase.prototype.has = function (key) {
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(this.memoryStorage.has(key));
    };
    MemoryDatabase.ɵprov = ɵɵdefineInjectable({ factory: function MemoryDatabase_Factory() { return new MemoryDatabase(); }, token: MemoryDatabase, providedIn: "root" });
    MemoryDatabase = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], MemoryDatabase);
    return MemoryDatabase;
}());

/**
 * Factory to create a storage according to browser support
 * @param platformId Context about the platform (`browser`, `server`...)
 * @param LSPrefix Prefix for `localStorage` keys to avoid collision for multiple apps on the same subdomain
 * @param IDBDBName `indexedDB` database name
 * @param IDBstoreName `indexedDB` storeName name
 * @see {@link https://github.com/cyrilletuzi/angular-async-local-storage/blob/master/docs/BROWSERS_SUPPORT.md}
 */
function localDatabaseFactory(platformId, LSPrefix, IDBDBName, IDBStoreName, IDBDBVersion, IDBNoWrap) {
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
var LocalDatabase = /** @class */ (function () {
    function LocalDatabase() {
    }
    LocalDatabase.ɵprov = ɵɵdefineInjectable({ factory: function LocalDatabase_Factory() { return localDatabaseFactory(ɵɵinject(PLATFORM_ID), ɵɵinject(LS_PREFIX), ɵɵinject(IDB_DB_NAME), ɵɵinject(IDB_STORE_NAME), ɵɵinject(IDB_DB_VERSION), ɵɵinject(IDB_NO_WRAP)); }, token: LocalDatabase, providedIn: "root" });
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
    return LocalDatabase;
}());

/**
 * Exception message when a value is not valid against the JSON schema
 */
var VALIDATION_ERROR = "Data stored is not valid against the provided JSON schema.\nCheck your JSON schema, otherwise it means data has been corrupted.";
/**
 * Exception raised when a value is not valid against the JSON schema
 */
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.message = VALIDATION_ERROR;
        return _this;
    }
    return ValidationError;
}(Error));

// TODO: detailed error messages?
var JSONValidator = /** @class */ (function () {
    function JSONValidator() {
    }
    /**
     * Validate a JSON data against a Jsubset of the JSON Schema standard.
     * Types are enforced to validate everything: each schema must
     * @param data JSON data to validate
     * @param schema Subset of JSON Schema. Must have a `type`.
     * @returns If data is valid: `true`, if it is invalid: `false`
     * @see {@link https://github.com/cyrilletuzi/angular-async-local-storage/blob/master/docs/VALIDATION.md}
     */
    JSONValidator.prototype.validate = function (data, schema) {
        switch (schema.type) {
            case 'string':
                return this.validateString(data, schema);
            case 'number':
            case 'integer':
                return this.validateNumber(data, schema);
            case 'boolean':
                return this.validateBoolean(data, schema);
            case 'array':
                return this.validateArray(data, schema);
            case 'object':
                return this.validateObject(data, schema);
        }
    };
    /**
     * Validate a string
     * @param data Data to validate
     * @param schema Schema describing the string
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    JSONValidator.prototype.validateString = function (data, schema) {
        if (typeof data !== 'string') {
            return false;
        }
        if (!this.validateConst(data, schema)) {
            return false;
        }
        if (!this.validateEnum(data, schema)) {
            return false;
        }
        if ((schema.maxLength !== undefined) && (data.length > schema.maxLength)) {
            return false;
        }
        if ((schema.minLength !== undefined) && (data.length < schema.minLength)) {
            return false;
        }
        if (schema.pattern) {
            var regularExpression = null;
            try {
                regularExpression = new RegExp(schema.pattern);
            }
            catch (_a) { }
            if (regularExpression && !regularExpression.test(data)) {
                return false;
            }
        }
        return true;
    };
    /**
     * Validate a number or an integer
     * @param data Data to validate
     * @param schema Schema describing the number or integer
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    JSONValidator.prototype.validateNumber = function (data, schema) {
        if (typeof data !== 'number') {
            return false;
        }
        if ((schema.type === 'integer') && !Number.isInteger(data)) {
            return false;
        }
        if (!this.validateConst(data, schema)) {
            return false;
        }
        if (!this.validateEnum(data, schema)) {
            return false;
        }
        /* Test is done this way to not divide by 0 */
        if (schema.multipleOf && !Number.isInteger(data / schema.multipleOf)) {
            return false;
        }
        if ((schema.maximum !== undefined) && (data > schema.maximum)) {
            return false;
        }
        if ((schema.exclusiveMaximum !== undefined) && (data >= schema.exclusiveMaximum)) {
            return false;
        }
        if ((schema.minimum !== undefined) && (data < schema.minimum)) {
            return false;
        }
        if ((schema.exclusiveMinimum !== undefined) && (data <= schema.exclusiveMinimum)) {
            return false;
        }
        return true;
    };
    /**
     * Validate a boolean
     * @param data Data to validate
     * @param schema Schema describing the boolean
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    JSONValidator.prototype.validateBoolean = function (data, schema) {
        if (typeof data !== 'boolean') {
            return false;
        }
        if (!this.validateConst(data, schema)) {
            return false;
        }
        return true;
    };
    /**
     * Validate an array
     * @param data Data to validate
     * @param schema Schema describing the array
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    JSONValidator.prototype.validateArray = function (data, schema) {
        var e_1, _a;
        if (!Array.isArray(data)) {
            return false;
        }
        if ((schema.maxItems !== undefined) && (data.length > schema.maxItems)) {
            return false;
        }
        if ((schema.minItems !== undefined) && (data.length < schema.minItems)) {
            return false;
        }
        if (schema.uniqueItems) {
            /* Create a set to eliminate values with multiple occurences */
            var dataSet = new Set(data);
            if (data.length !== dataSet.size) {
                return false;
            }
        }
        /* Specific test for tuples */
        if (Array.isArray(schema.items)) {
            return this.validateTuple(data, schema.items);
        }
        try {
            /* Validate all the values in array */
            for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var value = data_1_1.value;
                if (!this.validate(value, schema.items)) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    };
    /**
     * Validate a tuple (array with fixed length and multiple types)
     * @param data Data to validate
     * @param schemas Schemas describing the tuple
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    JSONValidator.prototype.validateTuple = function (data, schemas) {
        /* Tuples have a fixed length */
        if (data.length !== schemas.length) {
            return false;
        }
        for (var i = 0; i < schemas.length; i += 1) {
            if (!this.validate(data[i], schemas[i])) {
                return false;
            }
        }
        return true;
    };
    /**
     * Validate an object
     * @param data Data to validate
     * @param schema JSON schema describing the object
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    JSONValidator.prototype.validateObject = function (data, schema) {
        var e_2, _a;
        /* Check the type and if not `null` as `null` also have the type `object` in old browsers */
        if ((typeof data !== 'object') || (data === null)) {
            return false;
        }
        /* Check if the object doesn't have more properties than expected
         * Equivalent of `additionalProperties: false`
         */
        if (Object.keys(schema.properties).length < Object.keys(data).length) {
            return false;
        }
        /* Validate required properties */
        if (schema.required) {
            try {
                for (var _b = __values(schema.required), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var requiredProp = _c.value;
                    if (!data.hasOwnProperty(requiredProp)) {
                        return false;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        /* Recursively validate all properties */
        for (var property in schema.properties) {
            /* Filter to keep only real properties (no internal JS stuff) and check if the data has the property too */
            if (schema.properties.hasOwnProperty(property) && data.hasOwnProperty(property)) {
                if (!this.validate(data[property], schema.properties[property])) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * Validate a constant
     * @param data Data ta validate
     * @param schema JSON schema describing the constant
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    JSONValidator.prototype.validateConst = function (data, schema) {
        if (!schema.const) {
            return true;
        }
        return (data === schema.const);
    };
    /**
     * Validate an enum
     * @param data Data ta validate
     * @param schema JSON schema describing the enum
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    JSONValidator.prototype.validateEnum = function (data, schema) {
        if (!schema.enum) {
            return true;
        }
        /* Cast as the data can be of multiple types, and so TypeScript is lost */
        return (schema.enum.includes(data));
    };
    JSONValidator.ɵprov = ɵɵdefineInjectable({ factory: function JSONValidator_Factory() { return new JSONValidator(); }, token: JSONValidator, providedIn: "root" });
    JSONValidator = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], JSONValidator);
    return JSONValidator;
}());

var StorageMap = /** @class */ (function () {
    /**
     * Constructor params are provided by Angular (but can also be passed manually in tests)
     * @param database Storage to use
     * @param jsonValidator Validator service
     * @param LSPrefix Prefix for `localStorage` keys to avoid collision for multiple apps on the same subdomain or for interoperability
     */
    function StorageMap(database, jsonValidator, LSPrefix) {
        if (jsonValidator === void 0) { jsonValidator = new JSONValidator(); }
        if (LSPrefix === void 0) { LSPrefix = ''; }
        this.database = database;
        this.jsonValidator = jsonValidator;
        this.LSPrefix = LSPrefix;
        this.notifiers = new Map();
    }
    Object.defineProperty(StorageMap.prototype, "size", {
        /**
         * **Number of items** in storage, wrapped in an `Observable`.
         *
         * @example
         * this.storageMap.size.subscribe((size) => {
         *   console.log(size);
         * });
         */
        get: function () {
            var _this = this;
            return this.database.size
                /* Catch if `indexedDb` is broken */
                .pipe(this.catchIDBBroken(function () { return _this.database.size; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StorageMap.prototype, "backingEngine", {
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
        get: function () {
            if (this.database instanceof IndexedDBDatabase) {
                return 'indexedDB';
            }
            else if (this.database instanceof LocalStorageDatabase) {
                return 'localStorage';
            }
            else if (this.database instanceof MemoryDatabase) {
                return 'memory';
            }
            else {
                return 'unknown';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StorageMap.prototype, "backingStore", {
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
        get: function () {
            return (this.database instanceof IndexedDBDatabase) ?
                this.database.backingStore :
                { database: '', store: '', version: 0 };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StorageMap.prototype, "fallbackBackingStore", {
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
        get: function () {
            return (this.database instanceof LocalStorageDatabase) ?
                { prefix: this.database.prefix } :
                { prefix: '' };
        },
        enumerable: true,
        configurable: true
    });
    StorageMap.prototype.get = function (key, schema) {
        var _this = this;
        /* Get the data in storage */
        return this.database.get(key).pipe(
        /* Check if `indexedDb` is broken */
        this.catchIDBBroken(function () { return _this.database.get(key); }), mergeMap(function (data) {
            /* No need to validate if the data is empty */
            if ((data === undefined) || (data === null)) {
                return of(undefined);
            }
            else if (schema) {
                /* Validate data against a JSON schema if provided */
                if (!_this.jsonValidator.validate(data, schema)) {
                    return throwError(new ValidationError());
                }
                /* Data have been checked, so it's OK to cast */
                return of(data);
            }
            /* Cast to unknown as the data wasn't checked */
            return of(data);
        }));
    };
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
    StorageMap.prototype.set = function (key, data, schema) {
        var _this = this;
        /* Storing `undefined` or `null` is useless and can cause issues in `indexedDb` in some browsers,
         * so removing item instead for all storages to have a consistent API */
        if ((data === undefined) || (data === null)) {
            return this.delete(key);
        }
        /* Validate data against a JSON schema if provided */
        if (schema && !this.jsonValidator.validate(data, schema)) {
            return throwError(new ValidationError());
        }
        return this.database.set(key, data).pipe(
        /* Catch if `indexedDb` is broken */
        this.catchIDBBroken(function () { return _this.database.set(key, data); }), 
        /* Notify watchers (must be last because it should only happen if the operation succeeds) */
        tap(function () { _this.notify(key, data); }));
    };
    /**
     * Delete an item in storage
     * @param key The item's key
     * @returns A RxJS `Observable` to wait the end of the operation
     *
     * @example
     * this.storageMap.delete('key').subscribe(() => {});
     */
    StorageMap.prototype.delete = function (key) {
        var _this = this;
        return this.database.delete(key).pipe(
        /* Catch if `indexedDb` is broken */
        this.catchIDBBroken(function () { return _this.database.delete(key); }), 
        /* Notify watchers (must be last because it should only happen if the operation succeeds) */
        tap(function () { _this.notify(key, undefined); }));
    };
    /**
     * Delete all items in storage
     * @returns A RxJS `Observable` to wait the end of the operation
     *
     * @example
     * this.storageMap.clear().subscribe(() => {});
     */
    StorageMap.prototype.clear = function () {
        var _this = this;
        return this.database.clear().pipe(
        /* Catch if `indexedDb` is broken */
        this.catchIDBBroken(function () { return _this.database.clear(); }), 
        /* Notify watchers (must be last because it should only happen if the operation succeeds) */
        tap(function () {
            var e_1, _a;
            try {
                for (var _b = __values(_this.notifiers.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    _this.notify(key, undefined);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }));
    };
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
    StorageMap.prototype.keys = function () {
        var _this = this;
        return this.database.keys()
            /* Catch if `indexedDb` is broken */
            .pipe(this.catchIDBBroken(function () { return _this.database.keys(); }));
    };
    /**
     * Tells if a key exists in storage
     * @returns A RxJS `Observable` telling if the key exists
     *
     * @example
     * this.storageMap.has('key').subscribe((hasKey) => {
     *   if (hasKey) {}
     * });
     */
    StorageMap.prototype.has = function (key) {
        var _this = this;
        return this.database.has(key)
            /* Catch if `indexedDb` is broken */
            .pipe(this.catchIDBBroken(function () { return _this.database.has(key); }));
    };
    StorageMap.prototype.watch = function (key, schema) {
        /* Check if there is already a notifier and cast according to schema */
        var notifier = this.notifiers.get(key);
        if (!notifier) {
            /* Create a notifier and cast according to schema */
            notifier = new ReplaySubject(1);
            /* Memorize the notifier */
            this.notifiers.set(key, notifier);
            /* Get the current item value */
            this.get(key, schema).subscribe({
                next: function (result) { return notifier.next(result); },
                error: function (error) { return notifier.error(error); },
            });
        }
        /* Only the public API of the `Observable` should be returned */
        return notifier.asObservable();
    };
    /**
     * Notify when a value changes
     * @param key The item's key
     * @param data The new value
     */
    StorageMap.prototype.notify = function (key, value) {
        var notifier = this.notifiers.get(key);
        if (notifier) {
            notifier.next(value);
        }
    };
    /**
     * RxJS operator to catch if `indexedDB` is broken
     * @param operationCallback Callback with the operation to redo
     */
    StorageMap.prototype.catchIDBBroken = function (operationCallback) {
        var _this = this;
        return catchError(function (error) {
            /* Check if `indexedDB` is broken based on error message (the specific error class seems to be lost in the process) */
            if ((error !== undefined) && (error !== null) && (error.message === IDB_BROKEN_ERROR)) {
                /* When storage is fully disabled in browser (via the "Block all cookies" option),
                 * just trying to check `localStorage` variable causes a security exception.
                 * Prevents https://github.com/cyrilletuzi/angular-async-local-storage/issues/118
                 */
                try {
                    if ('getItem' in localStorage) {
                        /* Fallback to `localStorage` if available */
                        _this.database = new LocalStorageDatabase(_this.LSPrefix);
                    }
                    else {
                        /* Fallback to memory storage otherwise */
                        _this.database = new MemoryDatabase();
                    }
                }
                catch (_a) {
                    /* Fallback to memory storage otherwise */
                    _this.database = new MemoryDatabase();
                }
                /* Redo the operation */
                return operationCallback();
            }
            else {
                /* Otherwise, rethrow the error */
                return throwError(error);
            }
        });
    };
    StorageMap.ctorParameters = function () { return [
        { type: LocalDatabase },
        { type: JSONValidator },
        { type: undefined, decorators: [{ type: Inject, args: [LS_PREFIX,] }] }
    ]; };
    StorageMap.ɵprov = ɵɵdefineInjectable({ factory: function StorageMap_Factory() { return new StorageMap(ɵɵinject(LocalDatabase), ɵɵinject(JSONValidator), ɵɵinject(LS_PREFIX)); }, token: StorageMap, providedIn: "root" });
    StorageMap = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __param(2, Inject(LS_PREFIX))
    ], StorageMap);
    return StorageMap;
}());

var LocalStorage = /** @class */ (function () {
    /* Use the `StorageMap` service to avoid code duplication */
    function LocalStorage(storageMap) {
        this.storageMap = storageMap;
    }
    Object.defineProperty(LocalStorage.prototype, "length", {
        /**
         * Number of items in storage wrapped in an `Observable`
         *
         * @example
         * this.localStorage.length.subscribe((length) => {
         *   console.log(length);
         * });
         */
        get: function () {
            return this.storageMap.size;
        },
        enumerable: true,
        configurable: true
    });
    LocalStorage.prototype.getItem = function (key, schema) {
        if (schema) {
            /* Backward compatibility with version <= 7 */
            var schemaFinal = ('schema' in schema) ? schema.schema : schema;
            return this.storageMap.get(key, schemaFinal).pipe(
            /* Transform `undefined` into `null` to align with `localStorage` API */
            map(function (value) { return (value !== undefined) ? value : null; }));
        }
        else {
            return this.storageMap.get(key).pipe(
            /* Transform `undefined` into `null` to align with `localStorage` API */
            map(function (value) { return (value !== undefined) ? value : null; }));
        }
    };
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
    LocalStorage.prototype.setItem = function (key, data, schema) {
        return this.storageMap.set(key, data, schema).pipe(
        /* Transform `undefined` into `true` for backward compatibility with v7 */
        mapTo(true));
    };
    /**
     * Delete an item in storage
     * @param key The item's key
     * @returns A RxJS `Observable` to wait the end of the operation
     *
     * @example
     * this.localStorage.delete('key').subscribe(() => {});
     */
    LocalStorage.prototype.removeItem = function (key) {
        return this.storageMap.delete(key).pipe(
        /* Transform `undefined` into `true` for backward compatibility with v7 */
        mapTo(true));
    };
    /**
     * Delete all items in storage
     * @returns A RxJS `Observable` to wait the end of the operation
     *
     * @example
     * this.localStorage.clear().subscribe(() => {});
     */
    LocalStorage.prototype.clear = function () {
        return this.storageMap.clear().pipe(
        /* Transform `undefined` into `true` for backward compatibility with v7 */
        mapTo(true));
    };
    LocalStorage.ctorParameters = function () { return [
        { type: StorageMap }
    ]; };
    LocalStorage.ɵprov = ɵɵdefineInjectable({ factory: function LocalStorage_Factory() { return new LocalStorage(ɵɵinject(StorageMap)); }, token: LocalStorage, providedIn: "root" });
    LocalStorage = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], LocalStorage);
    return LocalStorage;
}());

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

/*
 * Public API Surface of local-storage
 */

/**
 * Generated bundle index. Do not edit.
 */

export { JSONValidator, LocalDatabase, LocalStorage, SERIALIZATION_ERROR, SerializationError, StorageMap, StorageModule, VALIDATION_ERROR, ValidationError, LS_PREFIX as ɵa, IDB_DB_NAME as ɵb, IDB_DB_VERSION as ɵc, IDB_STORE_NAME as ɵd, IDB_NO_WRAP as ɵe };
//# sourceMappingURL=ngx-pwa-local-storage.js.map
