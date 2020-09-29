import { __decorate, __param } from "tslib";
import { Injectable, Inject } from '@angular/core';
import { ReplaySubject, fromEvent, of, throwError, race } from 'rxjs';
import { map, mergeMap, first, takeWhile, tap, mapTo } from 'rxjs/operators';
import { IDBBrokenError } from './exceptions';
import { IDB_DB_NAME, IDB_STORE_NAME, DEFAULT_IDB_STORE_NAME, IDB_DB_VERSION, DEFAULT_IDB_DB_NAME, DEFAULT_IDB_DB_VERSION, IDB_NO_WRAP, DEFAULT_IDB_NO_WRAP } from '../tokens';
import * as i0 from "@angular/core";
import * as i1 from "../tokens";
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
    IndexedDBDatabase.ɵprov = i0.ɵɵdefineInjectable({ factory: function IndexedDBDatabase_Factory() { return new IndexedDBDatabase(i0.ɵɵinject(i1.IDB_DB_NAME), i0.ɵɵinject(i1.IDB_STORE_NAME), i0.ɵɵinject(i1.IDB_DB_VERSION), i0.ɵɵinject(i1.IDB_NO_WRAP)); }, token: IndexedDBDatabase, providedIn: "root" });
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
export { IndexedDBDatabase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhlZGRiLWRhdGFiYXNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1wd2EvbG9jYWwtc3RvcmFnZS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhYmFzZXMvaW5kZXhlZGRiLWRhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQWMsYUFBYSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRixPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUc3RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzlDLE9BQU8sRUFDTCxXQUFXLEVBQUUsY0FBYyxFQUFFLHNCQUFzQixFQUFFLGNBQWMsRUFDbkUsbUJBQW1CLEVBQUUsc0JBQXNCLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUM5RSxNQUFNLFdBQVcsQ0FBQzs7O0FBS25CO0lBaUNFOzs7Ozs7T0FNRztJQUNILDJCQUN1QixNQUE0QixFQUN6QixTQUFrQyxFQUNsQyxTQUFrQyxFQUNyQyxNQUE0QjtRQUg1Qix1QkFBQSxFQUFBLDRCQUE0QjtRQUN6QiwwQkFBQSxFQUFBLGtDQUFrQztRQUNsQywwQkFBQSxFQUFBLGtDQUFrQztRQUNyQyx1QkFBQSxFQUFBLDRCQUE0QjtRQTNCbkQ7OztXQUdHO1FBQ2dCLGFBQVEsR0FBRyxJQUFJLGFBQWEsQ0FBYyxDQUFDLENBQUMsQ0FBQztRQU9oRTs7V0FFRztRQUNnQixjQUFTLEdBQUcsT0FBTyxDQUFDO1FBZ0JyQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJ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V0FBMkI7UUFFM0Qsb0NBQW9DO1FBQ3BDLElBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFckQsaUNBQWlDO1FBQ2pDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFN0MscUNBQXFDO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFFbkMsQ0FBQzs7Z0RBclpFLE1BQU0sU0FBQyxXQUFXO2dEQUNsQixNQUFNLFNBQUMsY0FBYztnREFDckIsTUFBTSxTQUFDLGNBQWM7Z0RBQ3JCLE1BQU0sU0FBQyxXQUFXOzs7SUE1Q1YsaUJBQWlCO1FBSDdCLFVBQVUsQ0FBQztZQUNWLFVBQVUsRUFBRSxNQUFNO1NBQ25CLENBQUM7UUEwQ0csV0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkIsV0FBQSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDdEIsV0FBQSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDdEIsV0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUE7T0E1Q1gsaUJBQWlCLENBZ2M3Qjs0QkE5Y0Q7Q0E4Y0MsQUFoY0QsSUFnY0M7U0FoY1ksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBSZXBsYXlTdWJqZWN0LCBmcm9tRXZlbnQsIG9mLCB0aHJvd0Vycm9yLCByYWNlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIG1lcmdlTWFwLCBmaXJzdCwgdGFrZVdoaWxlLCB0YXAsIG1hcFRvIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBMb2NhbERhdGFiYXNlIH0gZnJvbSAnLi9sb2NhbC1kYXRhYmFzZSc7XG5pbXBvcnQgeyBJREJCcm9rZW5FcnJvciB9IGZyb20gJy4vZXhjZXB0aW9ucyc7XG5pbXBvcnQge1xuICBJREJfREJfTkFNRSwgSURCX1NUT1JFX05BTUUsIERFRkFVTFRfSURCX1NUT1JFX05BTUUsIElEQl9EQl9WRVJTSU9OLFxuICBERUZBVUxUX0lEQl9EQl9OQU1FLCBERUZBVUxUX0lEQl9EQl9WRVJTSU9OLCBJREJfTk9fV1JBUCwgREVGQVVMVF9JREJfTk9fV1JBUFxufSBmcm9tICcuLi90b2tlbnMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBJbmRleGVkREJEYXRhYmFzZSBpbXBsZW1lbnRzIExvY2FsRGF0YWJhc2Uge1xuXG4gIC8qKlxuICAgKiBgaW5kZXhlZERCYCBkYXRhYmFzZSBuYW1lXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgZGJOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBpbmRleGVkREJgIG9iamVjdCBzdG9yZSBuYW1lXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3RvcmVOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBpbmRleGVkREJgIGRhdGFiYXNlIHZlcnNpb24uIE11c3QgYmUgYW4gdW5zaWduZWQgKippbnRlZ2VyKipcbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSBkYlZlcnNpb246IG51bWJlcjtcblxuICAvKipcbiAgICogYGluZGV4ZWREQmAgZGF0YWJhc2UgY29ubmVjdGlvbiwgd3JhcHBlZCBpbiBhIFJ4SlMgYFJlcGxheVN1YmplY3RgIHRvIGJlIGFibGUgdG8gYWNjZXNzIHRoZSBjb25uZWN0aW9uXG4gICAqIGV2ZW4gYWZ0ZXIgdGhlIGNvbm5lY3Rpb24gc3VjY2VzcyBldmVudCBoYXBwZW5lZFxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGRhdGFiYXNlID0gbmV3IFJlcGxheVN1YmplY3Q8SURCRGF0YWJhc2U+KDEpO1xuXG4gIC8qKlxuICAgKiBGbGFnIHRvIG5vdCB3cmFwIGBpbmRleGVkREJgIHZhbHVlcyBmb3IgaW50ZXJvcGVyYWJpbGl0eSBvciB0byB3cmFwIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IG5vV3JhcDogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW5kZXggdXNlZCB3aGVuIHdyYXBwaW5nIHZhbHVlLiAqRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgb25seS4qXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgd3JhcEluZGV4ID0gJ3ZhbHVlJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgcGFyYW1zIGFyZSBwcm92aWRlZCBieSBBbmd1bGFyIChidXQgY2FuIGFsc28gYmUgcGFzc2VkIG1hbnVhbGx5IGluIHRlc3RzKVxuICAgKiBAcGFyYW0gZGJOYW1lIGBpbmRleGVkREJgIGRhdGFiYXNlIG5hbWVcbiAgICogQHBhcmFtIHN0b3JlTmFtZSBgaW5kZXhlZERCYCBzdG9yZSBuYW1lXG4gICAqIEBwYXJhbSBkYlZlcnNpb24gYGluZGV4ZWREQmAgZGF0YWJhc2UgdmVyc2lvblxuICAgKiBAcGFyYW0gbm9XcmFwIEZsYWcgdG8gbm90IHdyYXAgYGluZGV4ZWREQmAgdmFsdWVzIGZvciBpbnRlcm9wZXJhYmlsaXR5IG9yIHRvIHdyYXAgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoSURCX0RCX05BTUUpIGRiTmFtZSA9IERFRkFVTFRfSURCX0RCX05BTUUsXG4gICAgQEluamVjdChJREJfU1RPUkVfTkFNRSkgc3RvcmVOYW1lID0gREVGQVVMVF9JREJfU1RPUkVfTkFNRSxcbiAgICBASW5qZWN0KElEQl9EQl9WRVJTSU9OKSBkYlZlcnNpb24gPSBERUZBVUxUX0lEQl9EQl9WRVJTSU9OLFxuICAgIEBJbmplY3QoSURCX05PX1dSQVApIG5vV3JhcCA9IERFRkFVTFRfSURCX05PX1dSQVAsXG4gICkge1xuXG4gICAgdGhpcy5kYk5hbWUgPSBkYk5hbWU7XG4gICAgdGhpcy5zdG9yZU5hbWUgPSBzdG9yZU5hbWU7XG4gICAgdGhpcy5kYlZlcnNpb24gPSBkYlZlcnNpb247XG4gICAgdGhpcy5ub1dyYXAgPSBub1dyYXA7XG5cbiAgICAvKiBDb25uZWN0IHRvIGBpbmRleGVkREJgLCB3aXRoIHByZWZpeCBpZiBwcm92aWRlZCBieSB0aGUgdXNlciAqL1xuICAgIHRoaXMuY29ubmVjdCgpO1xuXG4gIH1cblxuICAvKipcbiAgICogSW5mb3JtYXRpb24gYWJvdXQgYGluZGV4ZWREQmAgY29ubmVjdGlvbi4gKk9ubHkgdXNlZnVsIGZvciBpbnRlcm9wZXJhYmlsaXR5LipcbiAgICogQHJldHVybnMgYGluZGV4ZWREQmAgZGF0YWJhc2UgbmFtZSwgc3RvcmUgbmFtZSBhbmQgZGF0YWJhc2UgdmVyc2lvblxuICAgKi9cbiAgZ2V0IGJhY2tpbmdTdG9yZSgpOiB7IGRhdGFiYXNlOiBzdHJpbmcsIHN0b3JlOiBzdHJpbmcsIHZlcnNpb246IG51bWJlciB9IHtcblxuICAgIHJldHVybiB7XG4gICAgICBkYXRhYmFzZTogdGhpcy5kYk5hbWUsXG4gICAgICBzdG9yZTogdGhpcy5zdG9yZU5hbWUsXG4gICAgICB2ZXJzaW9uOiB0aGlzLmRiVmVyc2lvbixcbiAgICB9O1xuXG4gIH1cblxuICAvKipcbiAgICogTnVtYmVyIG9mIGl0ZW1zIGluIG91ciBgaW5kZXhlZERCYCBkYXRhYmFzZSBhbmQgb2JqZWN0IHN0b3JlXG4gICAqL1xuICBnZXQgc2l6ZSgpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuXG4gICAgLyogT3BlbiBhIHRyYW5zYWN0aW9uIGluIHJlYWQtb25seSBtb2RlICovXG4gICAgcmV0dXJuIHRoaXMudHJhbnNhY3Rpb24oJ3JlYWRvbmx5JykucGlwZShcbiAgICAgIG1lcmdlTWFwKCh0cmFuc2FjdGlvbkRhdGEpID0+IHtcblxuICAgICAgICBjb25zdCB7IHN0b3JlLCBldmVudHMgfSA9IHRyYW5zYWN0aW9uRGF0YTtcblxuICAgICAgICAvKiBSZXF1ZXN0IHRvIGtub3cgdGhlIG51bWJlciBvZiBpdGVtcyAqL1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gc3RvcmUuY291bnQoKTtcblxuICAgICAgICAvKiBSZXR1cm4gdGhlIHJlc3VsdCAqL1xuICAgICAgICByZXR1cm4gZXZlbnRzLnBpcGUobWFwKCgpID0+IHJlcXVlc3QucmVzdWx0KSk7XG5cbiAgICAgIH0pLFxuICAgICAgLyogVGhlIG9ic2VydmFibGUgd2lsbCBjb21wbGV0ZSBhZnRlciB0aGUgZmlyc3QgdmFsdWUgKi9cbiAgICAgIGZpcnN0KCksXG4gICAgKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gaXRlbSB2YWx1ZSBpbiBvdXIgYGluZGV4ZWREQmAgc3RvcmVcbiAgICogQHBhcmFtIGtleSBUaGUgaXRlbSdzIGtleVxuICAgKiBAcmV0dXJucyBUaGUgaXRlbSdzIHZhbHVlIGlmIHRoZSBrZXkgZXhpc3RzLCBgdW5kZWZpbmVkYCBvdGhlcndpc2UsIHdyYXBwZWQgaW4gYW4gUnhKUyBgT2JzZXJ2YWJsZWBcbiAgICovXG4gIGdldDxUID0gdW5rbm93bj4oa2V5OiBzdHJpbmcpOiBPYnNlcnZhYmxlPFTCoHwgdW5kZWZpbmVkPiB7XG5cbiAgICAvKiBPcGVuIGEgdHJhbnNhY3Rpb24gaW4gcmVhZC1vbmx5IG1vZGUgKi9cbiAgICByZXR1cm4gdGhpcy50cmFuc2FjdGlvbigncmVhZG9ubHknKS5waXBlKFxuICAgICAgbWVyZ2VNYXAoKHRyYW5zYWN0aW9uRGF0YSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHsgc3RvcmUsIGV2ZW50cyB9ID0gdHJhbnNhY3Rpb25EYXRhO1xuXG4gICAgICAgIC8qIFJlcXVlc3QgdGhlIHZhbHVlIHdpdGggdGhlIGtleSBwcm92aWRlZCBieSB0aGUgdXNlciAqL1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gc3RvcmUuZ2V0KGtleSk7XG5cbiAgICAgICAgLyogTGlzdGVuIGV2ZW50cyBhbmQgcmV0dXJuIHRoZSByZXN1bHQgKi9cbiAgICAgICAgcmV0dXJuIGV2ZW50cy5waXBlKG1hcCgoKSA9PiB7XG5cbiAgICAgICAgICBpZiAoKHJlcXVlc3QucmVzdWx0ICE9PSB1bmRlZmluZWQpICYmIChyZXF1ZXN0LnJlc3VsdCAhPT0gbnVsbCkpIHtcblxuICAgICAgICAgICAgLyogUHJpb3IgdG8gdjgsIHRoZSB2YWx1ZSB3YXMgd3JhcHBlZCBpbiBhbiBgeyB2YWx1ZTogLi4ufWAgb2JqZWN0ICovXG4gICAgICAgICAgICBpZiAoIXRoaXMubm9XcmFwICYmICh0eXBlb2YgcmVxdWVzdC5yZXN1bHQgPT09ICdvYmplY3QnKSAmJiAodGhpcy53cmFwSW5kZXggaW4gcmVxdWVzdC5yZXN1bHQpICYmXG4gICAgICAgICAgICAocmVxdWVzdC5yZXN1bHRbdGhpcy53cmFwSW5kZXhdICE9PSB1bmRlZmluZWQpICYmIChyZXF1ZXN0LnJlc3VsdFt0aGlzLndyYXBJbmRleF0gIT09IG51bGwpKSB7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIChyZXF1ZXN0LnJlc3VsdFt0aGlzLndyYXBJbmRleF0gYXMgVCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgLyogQ2FzdCB0byB0aGUgd2FudGVkIHR5cGUgKi9cbiAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucmVzdWx0IGFzIFQ7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8qIFJldHVybiBgdW5kZWZpbmVkYCBpZiB0aGUgdmFsdWUgaXMgZW1wdHkgKi9cbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgICAgIH0pKTtcblxuICAgICAgfSksXG4gICAgICAvKiBUaGUgb2JzZXJ2YWJsZSB3aWxsIGNvbXBsZXRlIGFmdGVyIHRoZSBmaXJzdCB2YWx1ZSAqL1xuICAgICAgZmlyc3QoKSxcbiAgICApO1xuXG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhbiBpdGVtIGluIG91ciBgaW5kZXhlZERCYCBzdG9yZVxuICAgKiBAcGFyYW0ga2V5IFRoZSBpdGVtJ3Mga2V5XG4gICAqIEBwYXJhbSBkYXRhIFRoZSBpdGVtJ3MgdmFsdWVcbiAgICogQHJldHVybnMgQW4gUnhKUyBgT2JzZXJ2YWJsZWAgdG8gd2FpdCB0aGUgZW5kIG9mIHRoZSBvcGVyYXRpb25cbiAgICovXG4gIHNldChrZXk6IHN0cmluZywgZGF0YTogdW5rbm93bik6IE9ic2VydmFibGU8dW5kZWZpbmVkPiB7XG5cbiAgICAvKiBTdG9yaW5nIGB1bmRlZmluZWRgIGluIGBpbmRleGVkRGJgIGNhbiBjYXVzZSBpc3N1ZXMgaW4gc29tZSBicm93c2VycyBzbyByZW1vdmluZyBpdGVtIGluc3RlYWQgKi9cbiAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWxldGUoa2V5KTtcbiAgICB9XG5cbiAgICAvKiBPcGVuIGEgdHJhbnNhY3Rpb24gaW4gd3JpdGUgbW9kZSAqL1xuICAgIHJldHVybiB0aGlzLnRyYW5zYWN0aW9uKCdyZWFkd3JpdGUnKS5waXBlKFxuICAgICAgbWVyZ2VNYXAoKHRyYW5zYWN0aW9uRGF0YSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHsgc3RvcmUsIGV2ZW50cyB9ID0gdHJhbnNhY3Rpb25EYXRhO1xuXG4gICAgICAgIC8qIFByaW9yIHRvIHY4LCBkYXRhIHdhcyB3cmFwcGVkIGluIGEgYHsgdmFsdWU6IC4uLiB9YCBvYmplY3QgKi9cbiAgICAgICAgY29uc3QgZGF0YVRvU3RvcmUgPSB0aGlzLm5vV3JhcCA/IGRhdGEgOiB7IFt0aGlzLndyYXBJbmRleF06IGRhdGEgfTtcblxuICAgICAgICAvKiBBZGQgaWYgdGhlIGl0ZW0gaXMgbm90IGV4aXN0aW5nIHlldCwgb3IgdXBkYXRlIG90aGVyd2lzZSAqL1xuICAgICAgICBzdG9yZS5wdXQoZGF0YVRvU3RvcmUsIGtleSk7XG5cbiAgICAgICAgLyogTGlzdGVuIHRvIGV2ZW50cyBhbmQgcmV0dXJuIGB1bmRlZmluZWRgIGFzIG5vIHZhbHVlIGlzIGV4cGVjdGVkICovXG4gICAgICAgIHJldHVybiBldmVudHMucGlwZShtYXBUbyh1bmRlZmluZWQpKTtcblxuICAgICAgfSksXG4gICAgICAvKiBUaGUgb2JzZXJ2YWJsZSB3aWxsIGNvbXBsZXRlIGFmdGVyIHRoZSBmaXJzdCB2YWx1ZSAqL1xuICAgICAgZmlyc3QoKSxcbiAgICApO1xuXG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlcyBhbiBpdGVtIGluIG91ciBgaW5kZXhlZERCYCBzdG9yZVxuICAgKiBAcGFyYW0ga2V5IFRoZSBpdGVtJ3Mga2V5XG4gICAqIEByZXR1cm5zIEFuIFJ4SlMgYE9ic2VydmFibGVgIHRvIHdhaXQgdGhlIGVuZCBvZiB0aGUgb3BlcmF0aW9uXG4gICAqL1xuICBkZWxldGUoa2V5OiBzdHJpbmcpOiBPYnNlcnZhYmxlPHVuZGVmaW5lZD4ge1xuXG4gICAgLyogT3BlbiBhIHRyYW5zYWN0aW9uIGluIHdyaXRlIG1vZGUgKi9cbiAgICByZXR1cm4gdGhpcy50cmFuc2FjdGlvbigncmVhZHdyaXRlJykucGlwZShcbiAgICAgIG1lcmdlTWFwKCh0cmFuc2FjdGlvbkRhdGEpID0+IHtcblxuICAgICAgICBjb25zdCB7IHN0b3JlLCBldmVudHMgfSA9IHRyYW5zYWN0aW9uRGF0YTtcblxuICAgICAgICAvKiBEZWxldGUgdGhlIGl0ZW0gaW4gc3RvcmUgKi9cbiAgICAgICAgc3RvcmUuZGVsZXRlKGtleSk7XG5cbiAgICAgICAgLyogTGlzdGVuIHRvIGV2ZW50cyBhbmQgcmV0dXJuIGB1bmRlZmluZWRgIGFzIG5vIGRhdGEgaXMgZXhwZWN0ZWQgaGVyZSAqL1xuICAgICAgICByZXR1cm4gZXZlbnRzLnBpcGUobWFwVG8odW5kZWZpbmVkKSk7XG5cbiAgICAgIH0pLFxuICAgICAgLyogVGhlIG9ic2VydmFibGUgd2lsbCBjb21wbGV0ZSBhZnRlciB0aGUgZmlyc3QgdmFsdWUgKi9cbiAgICAgIGZpcnN0KCksXG4gICAgKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgYWxsIGl0ZW1zIGZyb20gb3VyIGBpbmRleGVkREJgIG9iamV0IHN0b3JlXG4gICAqIEByZXR1cm5zIEFuIFJ4SlMgYE9ic2VydmFibGVgIHRvIHdhaXQgdGhlIGVuZCBvZiB0aGUgb3BlcmF0aW9uXG4gICAqL1xuICBjbGVhcigpOiBPYnNlcnZhYmxlPHVuZGVmaW5lZD4ge1xuXG4gICAgLyogT3BlbiBhIHRyYW5zYWN0aW9uIGluIHdyaXRlIG1vZGUgKi9cbiAgICByZXR1cm4gdGhpcy50cmFuc2FjdGlvbigncmVhZHdyaXRlJykucGlwZShcbiAgICAgIG1lcmdlTWFwKCh0cmFuc2FjdGlvbkRhdGEpID0+IHtcblxuICAgICAgICBjb25zdCB7IHN0b3JlLCBldmVudHMgfSA9IHRyYW5zYWN0aW9uRGF0YTtcblxuICAgICAgICAvKiBEZWxldGUgYWxsIGl0ZW1zIGluIG9iamVjdCBzdG9yZSAqL1xuICAgICAgICBzdG9yZS5jbGVhcigpO1xuXG4gICAgICAgIC8qIExpc3RlbiB0byBldmVudHMgYW5kIHJldHVybiBgdW5kZWZpbmVkYCBhcyBubyBkYXRhIGlzIGV4cGVjdGVkIGhlcmUgKi9cbiAgICAgICAgcmV0dXJuIGV2ZW50cy5waXBlKG1hcFRvKHVuZGVmaW5lZCkpO1xuXG4gICAgICB9KSxcbiAgICAgIC8qIFRoZSBvYnNlcnZhYmxlIHdpbGwgY29tcGxldGUgKi9cbiAgICAgIGZpcnN0KCksXG4gICAgKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgdGhlIGtleXMgaW4gb3VyIGBpbmRleGVkREJgIHN0b3JlXG4gICAqIEByZXR1cm5zIEFuIFJ4SlMgYE9ic2VydmFibGVgIGl0ZXJhdGluZyBvbiBlYWNoIGtleVxuICAgKi9cbiAga2V5cygpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuXG4gICAgLyogT3BlbiBhIHRyYW5zYWN0aW9uIGluIHJlYWQtb25seSBtb2RlICovXG4gICAgcmV0dXJuIHRoaXMudHJhbnNhY3Rpb24oJ3JlYWRvbmx5JykucGlwZShcbiAgICAgIC8qIGBmaXJzdCgpYCBpcyB1c2VkIGFzIHRoZSBmaW5hbCBvcGVyYXRvciBpbiBvdGhlciBtZXRob2RzIHRvIGNvbXBsZXRlIHRoZSBgT2JzZXJ2YWJsZWBcbiAgICAgICAqIChhcyBpdCBhbGwgc3RhcnRzIGZyb20gYSBgUmVwbGF5U3ViamVjdGAgd2hpY2ggbmV2ZXIgZW5kcyksXG4gICAgICAgKiBidXQgYXMgdGhpcyBtZXRob2QgaXMgaXRlcmF0aW5nIG92ZXIgbXVsdGlwbGUgdmFsdWVzLCBgZmlyc3QoKWAgKiptdXN0KiogYmUgdXNlZCBoZXJlICovXG4gICAgICBmaXJzdCgpLFxuICAgICAgbWVyZ2VNYXAoKHRyYW5zYWN0aW9uRGF0YSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHsgc3RvcmUgfSA9IHRyYW5zYWN0aW9uRGF0YTtcblxuICAgICAgICAvKiBPcGVuIGEgY3Vyc29yIG9uIHRoZSBzdG9yZVxuICAgICAgICAgKiBgLm9wZW5LZXlDdXJzb3IoKWAgaXMgYmV0dGVyIGZvciBwZXJmb3JtYW5jZSwgYnV0IG9ubHkgYXZhaWxhYmxlIGluIGluZGV4ZWREQiB2MiAobWlzc2luZyBpbiBJRS9FZGdlKVxuICAgICAgICAgKiBBdm9pZCBpc3N1ZXMgbGlrZSBodHRwczovL2dpdGh1Yi5jb20vY3lyaWxsZXR1emkvYW5ndWxhci1hc3luYy1sb2NhbC1zdG9yYWdlL2lzc3Vlcy82OSAqL1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gKCdvcGVuS2V5Q3Vyc29yJyBpbiBzdG9yZSkgPyBzdG9yZS5vcGVuS2V5Q3Vyc29yKCkgOiAoc3RvcmUgYXMgSURCT2JqZWN0U3RvcmUpLm9wZW5DdXJzb3IoKTtcblxuICAgICAgICAvKiBMaXN0ZW4gdG8gc3VjY2VzcyBldmVudCAqL1xuICAgICAgICBjb25zdCBzdWNjZXNzJCA9IGZyb21FdmVudChyZXF1ZXN0LCAnc3VjY2VzcycpLnBpcGUoXG4gICAgICAgICAgLyogU3RvcCB0aGUgYE9ic2VydmFibGVgIHdoZW4gdGhlIGN1cnNvciBpcyBgbnVsbGAgKi9cbiAgICAgICAgICB0YWtlV2hpbGUoKCkgPT4gKHJlcXVlc3QucmVzdWx0ICE9PSBudWxsKSksXG4gICAgICAgICAgLyogVGhpcyBsaWIgb25seSBhbGxvd3Mgc3RyaW5nIGtleXMsIGJ1dCB1c2VyIGNvdWxkIGhhdmUgYWRkZWQgb3RoZXIgdHlwZXMgb2Yga2V5cyBmcm9tIG91dHNpZGVcbiAgICAgICAgICAgKiBJdCdzIE9LIHRvIGNhc3QgYXMgdGhlIGN1cnNvciBhcyBiZWVuIHRlc3RlZCBpbiB0aGUgcHJldmlvdXMgb3BlcmF0b3IgKi9cbiAgICAgICAgICBtYXAoKCkgPT4gKHJlcXVlc3QucmVzdWx0IGFzIElEQkN1cnNvcikua2V5LnRvU3RyaW5nKCkpLFxuICAgICAgICAgIC8qIEl0ZXJhdGUgb24gdGhlIGN1cnNvciAqL1xuICAgICAgICAgIHRhcCgoKSA9PiB7IChyZXF1ZXN0LnJlc3VsdCBhcyBJREJDdXJzb3IpLmNvbnRpbnVlKCk7IH0pLFxuICAgICAgICApO1xuXG4gICAgICAgIC8qIExpc3RlbiB0byBlcnJvciBldmVudCBhbmQgaWYgc28sIHRocm93IGFuIGVycm9yICovXG4gICAgICAgIGNvbnN0IGVycm9yJCA9IHRoaXMubGlzdGVuRXJyb3IocmVxdWVzdCk7XG5cbiAgICAgICAgLyogQ2hvb3NlIHRoZSBmaXJzdCBldmVudCB0byBvY2N1ciAqL1xuICAgICAgICByZXR1cm4gcmFjZShbc3VjY2VzcyQsIGVycm9yJF0pO1xuXG4gICAgICB9KSxcbiAgICApO1xuXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBrZXkgZXhpc3RzIGluIG91ciBgaW5kZXhlZERCYCBzdG9yZVxuICAgKiBAcmV0dXJucyBBbiBSeEpTIGBPYnNlcnZhYmxlYCB0ZWxsaW5nIGlmIHRoZSBrZXkgZXhpc3RzIG9yIG5vdFxuICAgKi9cbiAgaGFzKGtleTogc3RyaW5nKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG5cbiAgICAvKiBPcGVuIGEgdHJhbnNhY3Rpb24gaW4gcmVhZC1vbmx5IG1vZGUgKi9cbiAgICByZXR1cm4gdGhpcy50cmFuc2FjdGlvbigncmVhZG9ubHknKS5waXBlKFxuICAgICAgbWVyZ2VNYXAoKHRyYW5zYWN0aW9uRGF0YSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHsgc3RvcmUsIGV2ZW50cyB9ID0gdHJhbnNhY3Rpb25EYXRhO1xuXG4gICAgICAgIC8qIENoZWNrIGlmIHRoZSBrZXkgZXhpc3RzIGluIHRoZSBzdG9yZVxuICAgICAgICAgKiBgZ2V0S2V5KClgIGlzIGJldHRlciBidXQgb25seSBhdmFpbGFibGUgaW4gYGluZGV4ZWREQmAgdjIgKENocm9tZSA+PSA1OCwgbWlzc2luZyBpbiBJRS9FZGdlKS5cbiAgICAgICAgICogSW4gb2xkZXIgYnJvd3NlcnMsIHRoZSB2YWx1ZSBpcyBjaGVja2VkIGluc3RlYWQsIGJ1dCBpdCBjb3VsZCBsZWFkIHRvIGFuIGV4Y2VwdGlvblxuICAgICAgICAgKiBpZiBgdW5kZWZpbmVkYCB3YXMgc3RvcmVkIG91dHNpZGUgb2YgdGhpcyBsaWIgKGUuZy4gZGlyZWN0bHkgd2l0aCB0aGUgbmF0aXZlIGBpbmRleGVkREJgIEFQSSkuXG4gICAgICAgICAqIEZpeGVzIGh0dHBzOi8vZ2l0aHViLmNvbS9jeXJpbGxldHV6aS9hbmd1bGFyLWFzeW5jLWxvY2FsLXN0b3JhZ2UvaXNzdWVzLzY5XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gICgnZ2V0S2V5JyBpbiBzdG9yZSkgPyBzdG9yZS5nZXRLZXkoa2V5KSA6IChzdG9yZSBhcyBJREJPYmplY3RTdG9yZSkuZ2V0KGtleSk7XG5cbiAgICAgICAgLyogTGlzdGVuIHRvIGV2ZW50cyBhbmQgcmV0dXJuIGB0cnVlYCBvciBgZmFsc2VgICovXG4gICAgICAgIHJldHVybiBldmVudHMucGlwZShtYXAoKCkgPT4gKHJlcXVlc3QucmVzdWx0ICE9PSB1bmRlZmluZWQpID8gdHJ1ZSA6IGZhbHNlKSk7XG5cbiAgICAgIH0pLFxuICAgICAgLyogVGhlIG9ic2VydmFibGUgd2lsbCBjb21wbGV0ZSAqL1xuICAgICAgZmlyc3QoKSxcbiAgICApO1xuXG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdHMgdG8gYGluZGV4ZWREQmAgYW5kIGNyZWF0ZXMgdGhlIG9iamVjdCBzdG9yZSBvbiBmaXJzdCB0aW1lXG4gICAqL1xuICBwcm90ZWN0ZWQgY29ubmVjdCgpOiB2b2lkIHtcblxuICAgIGxldCByZXF1ZXN0OiBJREJPcGVuREJSZXF1ZXN0O1xuXG4gICAgLyogQ29ubmVjdCB0byBgaW5kZXhlZERCYFxuICAgICAqIFdpbGwgZmFpbCBpbiBTYWZhcmkgY3Jvc3Mtb3JpZ2luIGlmcmFtZXNcbiAgICAgKiBAc2VlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vY3lyaWxsZXR1emkvYW5ndWxhci1hc3luYy1sb2NhbC1zdG9yYWdlL2lzc3Vlcy80Mn0gKi9cbiAgICB0cnkge1xuXG4gICAgICAvKiBEbyBOT1QgZXhwbGljaXQgYHdpbmRvd2AgaGVyZSwgYXMgYGluZGV4ZWREQmAgY291bGQgYmUgdXNlZCBmcm9tIGEgd2ViIHdvcmtlciB0b28gKi9cbiAgICAgIHJlcXVlc3QgPSBpbmRleGVkREIub3Blbih0aGlzLmRiTmFtZSwgdGhpcy5kYlZlcnNpb24pO1xuXG4gICAgfcKgY2F0Y2gge1xuXG4gICAgICB0aGlzLmRhdGFiYXNlLmVycm9yKG5ldyBJREJCcm9rZW5FcnJvcigpKTtcblxuICAgICAgcmV0dXJuO1xuXG4gICAgfVxuXG4gICAgLyogQ3JlYXRlIHN0b3JlIG9uIGZpcnN0IGNvbm5lY3Rpb24gKi9cbiAgICB0aGlzLmNyZWF0ZVN0b3JlKHJlcXVlc3QpO1xuXG4gICAgLyogTGlzdGVuIHRvIHN1Y2Nlc3MgYW5kIGVycm9yIGV2ZW50cyAqL1xuICAgIGNvbnN0IHN1Y2Nlc3MkID0gZnJvbUV2ZW50KHJlcXVlc3QsICdzdWNjZXNzJyk7XG4gICAgY29uc3QgZXJyb3IkID0gdGhpcy5saXN0ZW5FcnJvcihyZXF1ZXN0KTtcblxuICAgIC8qIENob29zZSB0aGUgZmlyc3QgdG8gb2NjdXIgKi9cbiAgICByYWNlKFtzdWNjZXNzJCwgZXJyb3IkXSlcbiAgICAgIC8qIFRoZSBvYnNlcnZhYmxlIHdpbGwgY29tcGxldGUgKi9cbiAgICAgIC5waXBlKGZpcnN0KCkpXG4gICAgICAuc3Vic2NyaWJlKHtcbiAgICAgICAgbmV4dDogKCkgPT4ge1xuICAgICAgICAgIC8qIFJlZ2lzdGVyIHRoZSBkYXRhYmFzZSBjb25uZWN0aW9uIGluIHRoZSBgUmVwbGF5U3ViamVjdGAgZm9yIGZ1cnRoZXIgYWNjZXNzICovXG4gICAgICAgICAgdGhpcy5kYXRhYmFzZS5uZXh0KHJlcXVlc3QucmVzdWx0KTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6ICgpID0+IHtcbiAgICAgICAgICAvKiBGaXJlZm94IHByaXZhdGUgbW9kZSBpc3N1ZTogZmFsbGJhY2sgc3RvcmFnZSBpZiBJbmRleGVkRGIgY29ubmVjdGlvbiBpcyBmYWlsaW5nXG4gICAgICAgICAgKiBAc2VlIHtAbGluayBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD03ODE5ODJ9XG4gICAgICAgICAgKiBAc2VlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vY3lyaWxsZXR1emkvYW5ndWxhci1hc3luYy1sb2NhbC1zdG9yYWdlL2lzc3Vlcy8yNn0gKi9cbiAgICAgICAgICB0aGlzLmRhdGFiYXNlLmVycm9yKG5ldyBJREJCcm9rZW5FcnJvcigpKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHN0b3JlIG9uIGZpcnN0IHVzZSBvZiBgaW5kZXhlZERCYFxuICAgKiBAcGFyYW0gcmVxdWVzdCBgaW5kZXhlZERCYCBkYXRhYmFzZSBvcGVuaW5nIHJlcXVlc3RcbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVTdG9yZShyZXF1ZXN0OiBJREJPcGVuREJSZXF1ZXN0KTogdm9pZCB7XG5cbiAgICAvKiBMaXN0ZW4gdG8gdGhlIGV2ZW50IGZpcmVkIG9uIGZpcnN0IGNvbm5lY3Rpb24gKi9cbiAgICBmcm9tRXZlbnQocmVxdWVzdCwgJ3VwZ3JhZGVuZWVkZWQnKVxuICAgICAgLyogVGhlIG9ic2VydmFibGUgd2lsbCBjb21wbGV0ZSAqL1xuICAgICAgLnBpcGUoZmlyc3QoKSlcbiAgICAgIC5zdWJzY3JpYmUoe1xuICAgICAgICBuZXh0OiAoKSA9PiB7XG5cbiAgICAgICAgICAvKiBDaGVjayBpZiB0aGUgc3RvcmUgYWxyZWFkeSBleGlzdHMsIHRvIGF2b2lkIGVycm9yICovXG4gICAgICAgICAgaWYgKCFyZXF1ZXN0LnJlc3VsdC5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKHRoaXMuc3RvcmVOYW1lKSkge1xuXG4gICAgICAgICAgICAvKiBDcmVhdGUgdGhlIG9iamVjdCBzdG9yZSAqL1xuICAgICAgICAgICAgcmVxdWVzdC5yZXN1bHQuY3JlYXRlT2JqZWN0U3RvcmUodGhpcy5zdG9yZU5hbWUpO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gIH1cblxuICAvKipcbiAgICogT3BlbiBhbiBgaW5kZXhlZERCYCB0cmFuc2FjdGlvbiBhbmQgZ2V0IG91ciBzdG9yZVxuICAgKiBAcGFyYW0gbW9kZSBgcmVhZG9ubHlgIG9yIGByZWFkd3JpdGVgXG4gICAqIEByZXR1cm5zIEFuIGBpbmRleGVkREJgIHRyYW5zYWN0aW9uIHN0b3JlIGFuZCBldmVudHMsIHdyYXBwZWQgaW4gYW4gUnhKUyBgT2JzZXJ2YWJsZWBcbiAgICovXG4gIHByb3RlY3RlZCB0cmFuc2FjdGlvbihtb2RlOiBJREJUcmFuc2FjdGlvbk1vZGUpOiBPYnNlcnZhYmxlPHtcbiAgICBzdG9yZTogSURCT2JqZWN0U3RvcmU7XG4gICAgZXZlbnRzOiBPYnNlcnZhYmxlPEV2ZW50PjtcbiAgfT4ge1xuXG4gICAgLyogRnJvbSB0aGUgYGluZGV4ZWREQmAgY29ubmVjdGlvbiwgb3BlbiBhIHRyYW5zYWN0aW9uIGFuZCBnZXQgdGhlIHN0b3JlICovXG4gICAgcmV0dXJuIHRoaXMuZGF0YWJhc2VcbiAgICAgIC5waXBlKG1lcmdlTWFwKChkYXRhYmFzZSkgPT4ge1xuXG4gICAgICAgIGxldCB0cmFuc2FjdGlvbjogSURCVHJhbnNhY3Rpb247XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgIHRyYW5zYWN0aW9uID0gZGF0YWJhc2UudHJhbnNhY3Rpb24oW3RoaXMuc3RvcmVOYW1lXSwgbW9kZSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcblxuICAgICAgICAgICAgLyogVGhlIHN0b3JlIGNvdWxkIGhhdmUgYmVlbiBkZWxldGVkIGZyb20gb3V0c2lkZSAqL1xuICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IgYXMgRE9NRXhjZXB0aW9uKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyogR2V0IHRoZSBzdG9yZSBmcm9tIHRoZSB0cmFuc2FjdGlvbiAqL1xuICAgICAgICBjb25zdCBzdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuc3RvcmVOYW1lKTtcblxuICAgICAgICAvKiBMaXN0ZW4gdHJhbnNhY3Rpb24gYGNvbXBsZXRlYCBhbmQgYGVycm9yYCBldmVudHMgKi9cbiAgICAgICAgY29uc3QgZXZlbnRzID0gdGhpcy5saXN0ZW5UcmFuc2FjdGlvbkV2ZW50cyh0cmFuc2FjdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIG9mKHsgc3RvcmUsIGV2ZW50cyB9KTtcblxuICAgICAgfSkpO1xuXG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuIGVycm9ycyBvbiBhIHRyYW5zYWN0aW9uIG9yIHJlcXVlc3QsIGFuZCB0aHJvdyBpZiB0cmlnZXJyZWRcbiAgICogQHBhcmFtIHRyYW5zYWN0aW9uT3JSZXF1ZXN0IGBpbmRleGVkRGJgIHRyYW5zYWN0aW9uIG9yIHJlcXVlc3QgdG8gbGlzdGVuXG4gICAqIEByZXR1cm5zIEFuIGBPYnNlcnZhYmxlYCBsaXN0ZW5pbmcgdG8gZXJyb3JzXG4gICAqL1xuICBwcm90ZWN0ZWQgbGlzdGVuRXJyb3IodHJhbnNhY3Rpb25PclJlcXVlc3Q6IElEQlRyYW5zYWN0aW9uIHwgSURCUmVxdWVzdCk6IE9ic2VydmFibGU8bmV2ZXI+IHtcblxuICAgIHJldHVybiBmcm9tRXZlbnQodHJhbnNhY3Rpb25PclJlcXVlc3QsICdlcnJvcicpLnBpcGUoXG4gICAgICAvKiBUaHJvdyBvbiBlcnJvciB0byBiZSBhYmxlIHRvIGNhdGNoIGVycm9ycyBpbiBSeEpTIHdheSAqL1xuICAgICAgbWVyZ2VNYXAoKCkgPT4gdGhyb3dFcnJvcih0cmFuc2FjdGlvbk9yUmVxdWVzdC5lcnJvcikpLFxuICAgICk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gdHJhbnNhY3Rpb24gYGNvbXBsZXRlYCBhbmQgYGVycm9yYCBldmVudHNcbiAgICogQHBhcmFtIHRyYW5zYWN0aW9uIFRyYW5zYWN0aW9uIHRvIGxpc3RlblxuICAgKiBAcmV0dXJucyBBbiBgT2JzZXJ2YWJsZWAgbGlzdGVuaW5nIHRvIHRyYW5zYWN0aW9uIGBjb21wbGV0ZWAgYW5kIGBlcnJvcmAgZXZlbnRzXG4gICAqL1xuICBwcm90ZWN0ZWQgbGlzdGVuVHJhbnNhY3Rpb25FdmVudHModHJhbnNhY3Rpb246IElEQlRyYW5zYWN0aW9uKTogT2JzZXJ2YWJsZTxFdmVudD4ge1xuXG4gICAgLyogTGlzdGVuIHRvIHRoZSBgY29tcGxldGVgIGV2ZW50ICovXG4gICAgY29uc3QgY29tcGxldGUkID0gZnJvbUV2ZW50KHRyYW5zYWN0aW9uLCAnY29tcGxldGUnKTtcblxuICAgIC8qIExpc3RlbiB0byB0aGUgYGVycm9yYCBldmVudCAqL1xuICAgIGNvbnN0IGVycm9yJCA9IHRoaXMubGlzdGVuRXJyb3IodHJhbnNhY3Rpb24pO1xuXG4gICAgLyogQ2hvb3NlIHRoZSBmaXJzdCBldmVudCB0byBvY2N1ciAqL1xuICAgIHJldHVybiByYWNlKFtjb21wbGV0ZSQsIGVycm9yJF0pO1xuXG4gIH1cblxufVxuIl19