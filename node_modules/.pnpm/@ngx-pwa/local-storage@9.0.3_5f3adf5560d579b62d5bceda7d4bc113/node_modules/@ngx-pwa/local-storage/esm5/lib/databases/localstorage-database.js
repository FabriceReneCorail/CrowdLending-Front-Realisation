import { __decorate, __param } from "tslib";
import { Injectable, Inject } from '@angular/core';
import { Observable, of, throwError, asyncScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { SerializationError } from './exceptions';
import { LS_PREFIX } from '../tokens';
import * as i0 from "@angular/core";
import * as i1 from "../tokens";
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
    LocalStorageDatabase.ɵprov = i0.ɵɵdefineInjectable({ factory: function LocalStorageDatabase_Factory() { return new LocalStorageDatabase(i0.ɵɵinject(i1.LS_PREFIX)); }, token: LocalStorageDatabase, providedIn: "root" });
    LocalStorageDatabase = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __param(0, Inject(LS_PREFIX))
    ], LocalStorageDatabase);
    return LocalStorageDatabase;
}());
export { LocalStorageDatabase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxzdG9yYWdlLWRhdGFiYXNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1wd2EvbG9jYWwtc3RvcmFnZS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhYmFzZXMvbG9jYWxzdG9yYWdlLWRhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUczQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQzs7O0FBS3RDO0lBT0U7OztPQUdHO0lBQ0gsOEJBQ3FCLE1BQVc7UUFBWCx1QkFBQSxFQUFBLFdBQVc7UUFHOUIsNkNBQTZDO1FBQzdDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUU3QixDQUFDO0lBS0Qsc0JBQUksc0NBQUk7UUFIUjs7V0FFRzthQUNIO1lBRUUsc0VBQXNFO1lBQ3RFLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVqQyxDQUFDOzs7T0FBQTtJQUVEOzs7O09BSUc7SUFDSCxrQ0FBRyxHQUFILFVBQWlCLEdBQVc7UUFFMUIsa0JBQWtCO1FBQ2xCLElBQU0sWUFBWSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRS9ELElBQUksVUFBeUIsQ0FBQztRQUU5Qix1REFBdUQ7UUFDdkQsSUFBSSxDQUFDLFlBQVksS0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsRUFBRTtZQUUzRCxr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QUcsS0FBSyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBRXhDLHNFQUFzRTtnQkFDdEUsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7YUFFakI7U0FFRjtRQUVELHNFQUFzRTtRQUN0RSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVuQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNPLCtDQUFnQixHQUExQixVQUEyQixLQUFhO1FBRXRDLCtDQUErQztRQUMvQyxJQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTVDLElBQUksV0FBVyxLQUFLLElBQUksRUFBRTtZQUV4Qix3RUFBd0U7WUFDeEUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBRTVFO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFFZCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNPLHdDQUFTLEdBQW5CLFVBQW9CLEdBQVc7UUFFN0IsT0FBTyxLQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBSyxDQUFDO0lBRWhDLENBQUM7O2dEQS9MRSxNQUFNLFNBQUMsU0FBUzs7O0lBWlIsb0JBQW9CO1FBSGhDLFVBQVUsQ0FBQztZQUNWLFVBQVUsRUFBRSxNQUFNO1NBQ25CLENBQUM7UUFhRyxXQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtPQVpULG9CQUFvQixDQTZNaEM7K0JBeE5EO0NBd05DLEFBN01ELElBNk1DO1NBN01ZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IsIGFzeW5jU2NoZWR1bGVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBvYnNlcnZlT24gfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IExvY2FsRGF0YWJhc2UgfSBmcm9tICcuL2xvY2FsLWRhdGFiYXNlJztcbmltcG9ydCB7IFNlcmlhbGl6YXRpb25FcnJvciB9IGZyb20gJy4vZXhjZXB0aW9ucyc7XG5pbXBvcnQgeyBMU19QUkVGSVggfSBmcm9tICcuLi90b2tlbnMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2VEYXRhYmFzZSBpbXBsZW1lbnRzIExvY2FsRGF0YWJhc2Uge1xuXG4gIC8qKlxuICAgKiBPcHRpb25hbCB1c2VyIHByZWZpeCB0byBhdm9pZCBjb2xsaXNpb24gZm9yIG11bHRpcGxlIGFwcHMgb24gdGhlIHNhbWUgc3ViZG9tYWluXG4gICAqL1xuICByZWFkb25seSBwcmVmaXg6IHN0cmluZztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgcGFyYW1zIGFyZSBwcm92aWRlZCBieSBBbmd1bGFyIChidXQgY2FuIGFsc28gYmUgcGFzc2VkIG1hbnVhbGx5IGluIHRlc3RzKVxuICAgKiBAcGFyYW0gcHJlZml4IFByZWZpeCBvcHRpb24gdG8gYXZvaWQgY29sbGlzaW9uIGZvciBtdWx0aXBsZSBhcHBzIG9uIHRoZSBzYW1lIHN1YmRvbWFpbiBvciBmb3IgaW50ZXJvcGVyYWJpbGl0eVxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChMU19QUkVGSVgpIHByZWZpeCA9ICcnLFxuICApIHtcblxuICAgIC8qIFByZWZpeCBpZiBhc2tlZCwgb3Igbm8gcHJlZml4IG90aGVyd2lzZSAqL1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4IHx8ICcnO1xuXG4gIH1cblxuICAvKipcbiAgICogTnVtYmVyIG9mIGl0ZW1zIGluIGBsb2NhbFN0b3JhZ2VgXG4gICAqL1xuICBnZXQgc2l6ZSgpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuXG4gICAgLyogV3JhcCBpbiBhIFJ4SlMgYE9ic2VydmFibGVgIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBvdGhlciBzdG9yYWdlcyAqL1xuICAgIHJldHVybiBvZihsb2NhbFN0b3JhZ2UubGVuZ3RoKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gaXRlbSB2YWx1ZSBpbiBgbG9jYWxTdG9yYWdlYFxuICAgKiBAcGFyYW0ga2V5IFRoZSBpdGVtJ3Mga2V5XG4gICAqIEByZXR1cm5zIFRoZSBpdGVtJ3MgdmFsdWUgaWYgdGhlIGtleSBleGlzdHMsIGB1bmRlZmluZWRgIG90aGVyd2lzZSwgd3JhcHBlZCBpbiBhIFJ4SlMgYE9ic2VydmFibGVgXG4gICAqL1xuICBnZXQ8VCA9IHVua25vd24+KGtleTogc3RyaW5nKTogT2JzZXJ2YWJsZTxUIHwgdW5kZWZpbmVkPiB7XG5cbiAgICAvKiBHZXQgcmF3IGRhdGEgKi9cbiAgICBjb25zdCB1bnBhcnNlZERhdGEgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnByZWZpeEtleShrZXkpKTtcblxuICAgIGxldCBwYXJzZWREYXRhOiBUIHwgdW5kZWZpbmVkO1xuXG4gICAgLyogTm8gbmVlZCB0byBwYXJzZSBpZiBkYXRhIGlzIGBudWxsYCBvciBgdW5kZWZpbmVkYCAqL1xuICAgIGlmICgodW5wYXJzZWREYXRhICE9PSB1bmRlZmluZWQpICYmICh1bnBhcnNlZERhdGEgIT09IG51bGwpKSB7XG5cbiAgICAgIC8qIFRyeSB0byBwYXJzZSAqL1xuICAgICAgdHJ5IHtcbiAgICAgICAgcGFyc2VkRGF0YSA9IEpTT04ucGFyc2UodW5wYXJzZWREYXRhKSBhcyBUO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IgYXMgU3ludGF4RXJyb3IpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyogV3JhcCBpbiBhIFJ4SlMgYE9ic2VydmFibGVgIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBvdGhlciBzdG9yYWdlcyAqL1xuICAgIHJldHVybiBvZihwYXJzZWREYXRhKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFN0b3JlIGFuIGl0ZW0gaW4gYGxvY2FsU3RvcmFnZWBcbiAgICogQHBhcmFtIGtleSBUaGUgaXRlbSdzIGtleVxuICAgKiBAcGFyYW0gZGF0YSBUaGUgaXRlbSdzIHZhbHVlXG4gICAqIEByZXR1cm5zIEEgUnhKUyBgT2JzZXJ2YWJsZWAgdG8gd2FpdCB0aGUgZW5kIG9mIHRoZSBvcGVyYXRpb25cbiAgICovXG4gIHNldChrZXk6IHN0cmluZywgZGF0YTogdW5rbm93bik6IE9ic2VydmFibGU8dW5kZWZpbmVkPiB7XG5cbiAgICBsZXQgc2VyaWFsaXplZERhdGE6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gICAgLyogQ2hlY2sgaWYgZGF0YSBjYW4gYmUgc2VyaWFsaXplZCAqL1xuICAgIGNvbnN0IGRhdGFQcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZGF0YSk7XG4gICAgaWYgKCh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpICYmIChkYXRhICE9PSBudWxsKSAmJiAhQXJyYXkuaXNBcnJheShkYXRhKSAmJlxuICAgICEoKGRhdGFQcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGUpIHx8IChkYXRhUHJvdG90eXBlID09PSBudWxsKSkpIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKG5ldyBTZXJpYWxpemF0aW9uRXJyb3IoKSk7XG4gICAgfVxuXG4gICAgLyogVHJ5IHRvIHN0cmluZ2lmeSAoY2FuIGZhaWwgb24gY2lyY3VsYXIgcmVmZXJlbmNlcykgKi9cbiAgICB0cnkge1xuICAgICAgc2VyaWFsaXplZERhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IgYXMgVHlwZUVycm9yKTtcbiAgICB9XG5cbiAgICAvKiBDYW4gZmFpbCBpZiBzdG9yYWdlIHF1b3RhIGlzIGV4Y2VlZGVkICovXG4gICAgdHJ5IHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMucHJlZml4S2V5KGtleSksIHNlcmlhbGl6ZWREYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IgYXMgRE9NRXhjZXB0aW9uKTtcbiAgICB9XG5cbiAgICAvKiBXcmFwIGluIGEgUnhKUyBgT2JzZXJ2YWJsZWAgdG8gYmUgY29uc2lzdGVudCB3aXRoIG90aGVyIHN0b3JhZ2VzICovXG4gICAgcmV0dXJuIG9mKHVuZGVmaW5lZCk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGFuIGl0ZW0gaW4gYGxvY2FsU3RvcmFnZWBcbiAgICogQHBhcmFtIGtleSBUaGUgaXRlbSdzIGtleVxuICAgKiBAcmV0dXJucyBBIFJ4SlMgYE9ic2VydmFibGVgIHRvIHdhaXQgdGhlIGVuZCBvZiB0aGUgb3BlcmF0aW9uXG4gICAqL1xuICBkZWxldGUoa2V5OiBzdHJpbmcpOiBPYnNlcnZhYmxlPHVuZGVmaW5lZD4ge1xuXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5wcmVmaXhLZXkoa2V5KSk7XG5cbiAgICAvKiBXcmFwIGluIGEgUnhKUyBgT2JzZXJ2YWJsZWAgdG8gYmUgY29uc2lzdGVudCB3aXRoIG90aGVyIHN0b3JhZ2VzICovXG4gICAgcmV0dXJuIG9mKHVuZGVmaW5lZCk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGFsbCBpdGVtcyBpbiBgbG9jYWxTdG9yYWdlYFxuICAgKiBAcmV0dXJucyBBIFJ4SlMgYE9ic2VydmFibGVgIHRvIHdhaXQgdGhlIGVuZCBvZiB0aGUgb3BlcmF0aW9uXG4gICAqL1xuICBjbGVhcigpOiBPYnNlcnZhYmxlPHVuZGVmaW5lZD4ge1xuXG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG5cbiAgICAvKiBXcmFwIGluIGEgUnhKUyBgT2JzZXJ2YWJsZWAgdG8gYmUgY29uc2lzdGVudCB3aXRoIG90aGVyIHN0b3JhZ2VzICovXG4gICAgcmV0dXJuIG9mKHVuZGVmaW5lZCk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWxsIGtleXMgaW4gYGxvY2FsU3RvcmFnZWBcbiAgICogTm90ZSB0aGUgb3JkZXIgb2YgdGhlIGtleXMgbWF5IGJlIGluY29uc2lzdGVudCBpbiBGaXJlZm94XG4gICAqIEByZXR1cm5zIEEgUnhKUyBgT2JzZXJ2YWJsZWAgaXRlcmF0aW5nIG9uIGtleXNcbiAgICovXG4gIGtleXMoKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcblxuICAgIC8qIENyZWF0ZSBhbiBgT2JzZXJ2YWJsZWAgZnJvbSBrZXlzICovXG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPHN0cmluZz4oKHN1YnNjcmliZXIpID0+IHtcblxuICAgICAgLyogSXRlcmV0YXRlIG92ZXIgYWxsIHRoZSBpbmRleGVzICovXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsgaW5kZXggKz0gMSkge1xuXG4gICAgICAgIC8qIENhc3QgYXMgd2UgYXJlIHN1cmUgaW4gdGhpcyBjYXNlIHRoZSBrZXkgaXMgbm90IGBudWxsYCAqL1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQodGhpcy5nZXRVbnByZWZpeGVkS2V5KGluZGV4KSBhcyBzdHJpbmcpO1xuXG4gICAgICB9XG5cbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcblxuICAgIH0pLnBpcGUoXG4gICAgICAvKiBSZXF1aXJlZCB0byB3b3JrIGxpa2Ugb3RoZXIgZGF0YWJhc2VzIHdoaWNoIGFyZSBhc3luY2hyb25vdXMgKi9cbiAgICAgIG9ic2VydmVPbihhc3luY1NjaGVkdWxlciksXG4gICAgKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEga2V5IGV4aXN0cyBpbiBgbG9jYWxTdG9yYWdlYFxuICAgKiBAcGFyYW0ga2V5IFRoZSBpdGVtJ3Mga2V5XG4gICAqIEByZXR1cm5zIEEgUnhKUyBgT2JzZXJ2YWJsZWAgdGVsbGluZyBpZiB0aGUga2V5IGV4aXN0cyBvciBub3RcbiAgICovXG4gIGhhcyhrZXk6IHN0cmluZyk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuXG4gICAgLyogSXTDqXJhdGUgb3ZlciBhbGwgaW5kZXhlcyBpbiBzdG9yYWdlICovXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGluZGV4ICs9IDEpIHtcblxuICAgICAgaWYgKGtleSA9PT0gdGhpcy5nZXRVbnByZWZpeGVkS2V5KGluZGV4KSnCoHtcblxuICAgICAgICAvKiBXcmFwIGluIGEgUnhKUyBgT2JzZXJ2YWJsZWAgdG8gYmUgY29uc2lzdGVudCB3aXRoIG90aGVyIHN0b3JhZ2VzICovXG4gICAgICAgIHJldHVybiBvZih0cnVlKTtcblxuICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyogV3JhcCBpbiBhIFJ4SlMgYE9ic2VydmFibGVgIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBvdGhlciBzdG9yYWdlcyAqL1xuICAgIHJldHVybiBvZihmYWxzZSk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gdW5wcmVmaXhlZCBrZXlcbiAgICogQHBhcmFtIGluZGV4IEluZGV4IG9mIHRoZSBrZXlcbiAgICogQHJldHVybnMgVGhlIHVucHJlZml4ZWQga2V5IG5hbWUgaWYgZXhpc3RzLCBgbnVsbGAgb3RoZXJ3aXNlXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0VW5wcmVmaXhlZEtleShpbmRleDogbnVtYmVyKTogc3RyaW5nIHwgbnVsbCB7XG5cbiAgICAvKiBHZXQgdGhlIGtleSBpbiBzdG9yYWdlOiBtYXkgaGF2ZSBhIHByZWZpeCAqL1xuICAgIGNvbnN0IHByZWZpeGVkS2V5ID0gbG9jYWxTdG9yYWdlLmtleShpbmRleCk7XG5cbiAgICBpZiAocHJlZml4ZWRLZXkgIT09IG51bGwpIHtcblxuICAgICAgLyogSWYgbm8gcHJlZml4LCB0aGUga2V5IGlzIGFscmVhZHkgZ29vZCwgb3RoZXJ3cml0ZSBzdHJpcCB0aGUgcHJlZml4ICovXG4gICAgICByZXR1cm4gIXRoaXMucHJlZml4ID8gcHJlZml4ZWRLZXkgOiBwcmVmaXhlZEtleS5zdWJzdHIodGhpcy5wcmVmaXgubGVuZ3RoKTtcblxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuXG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBwcmVmaXggdG8gYSBrZXlcbiAgICogQHBhcmFtIGtleSBUaGUga2V5IG5hbWVcbiAgICogQHJldHVybnMgVGhlIHByZWZpeGVkIGtleSBuYW1lXG4gICAqL1xuICBwcm90ZWN0ZWQgcHJlZml4S2V5KGtleTogc3RyaW5nKTogc3RyaW5nIHtcblxuICAgIHJldHVybiBgJHt0aGlzLnByZWZpeH0ke2tleX1gO1xuXG4gIH1cblxufVxuIl19