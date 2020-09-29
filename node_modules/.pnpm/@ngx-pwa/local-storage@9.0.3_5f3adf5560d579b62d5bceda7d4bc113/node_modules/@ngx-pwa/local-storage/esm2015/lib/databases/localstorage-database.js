import { __decorate, __param } from "tslib";
import { Injectable, Inject } from '@angular/core';
import { Observable, of, throwError, asyncScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { SerializationError } from './exceptions';
import { LS_PREFIX } from '../tokens';
import * as i0 from "@angular/core";
import * as i1 from "../tokens";
let LocalStorageDatabase = class LocalStorageDatabase {
    /**
     * Constructor params are provided by Angular (but can also be passed manually in tests)
     * @param prefix Prefix option to avoid collision for multiple apps on the same subdomain or for interoperability
     */
    constructor(prefix = '') {
        /* Prefix if asked, or no prefix otherwise */
        this.prefix = prefix || '';
    }
    /**
     * Number of items in `localStorage`
     */
    get size() {
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(localStorage.length);
    }
    /**
     * Gets an item value in `localStorage`
     * @param key The item's key
     * @returns The item's value if the key exists, `undefined` otherwise, wrapped in a RxJS `Observable`
     */
    get(key) {
        /* Get raw data */
        const unparsedData = localStorage.getItem(this.prefixKey(key));
        let parsedData;
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
    }
    /**
     * Store an item in `localStorage`
     * @param key The item's key
     * @param data The item's value
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    set(key, data) {
        let serializedData = null;
        /* Check if data can be serialized */
        const dataPrototype = Object.getPrototypeOf(data);
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
    }
    /**
     * Deletes an item in `localStorage`
     * @param key The item's key
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    delete(key) {
        localStorage.removeItem(this.prefixKey(key));
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(undefined);
    }
    /**
     * Deletes all items in `localStorage`
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    clear() {
        localStorage.clear();
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(undefined);
    }
    /**
     * Get all keys in `localStorage`
     * Note the order of the keys may be inconsistent in Firefox
     * @returns A RxJS `Observable` iterating on keys
     */
    keys() {
        /* Create an `Observable` from keys */
        return new Observable((subscriber) => {
            /* Iteretate over all the indexes */
            for (let index = 0; index < localStorage.length; index += 1) {
                /* Cast as we are sure in this case the key is not `null` */
                subscriber.next(this.getUnprefixedKey(index));
            }
            subscriber.complete();
        }).pipe(
        /* Required to work like other databases which are asynchronous */
        observeOn(asyncScheduler));
    }
    /**
     * Check if a key exists in `localStorage`
     * @param key The item's key
     * @returns A RxJS `Observable` telling if the key exists or not
     */
    has(key) {
        /* Itérate over all indexes in storage */
        for (let index = 0; index < localStorage.length; index += 1) {
            if (key === this.getUnprefixedKey(index)) {
                /* Wrap in a RxJS `Observable` to be consistent with other storages */
                return of(true);
            }
        }
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(false);
    }
    /**
     * Get an unprefixed key
     * @param index Index of the key
     * @returns The unprefixed key name if exists, `null` otherwise
     */
    getUnprefixedKey(index) {
        /* Get the key in storage: may have a prefix */
        const prefixedKey = localStorage.key(index);
        if (prefixedKey !== null) {
            /* If no prefix, the key is already good, otherwrite strip the prefix */
            return !this.prefix ? prefixedKey : prefixedKey.substr(this.prefix.length);
        }
        return null;
    }
    /**
     * Add the prefix to a key
     * @param key The key name
     * @returns The prefixed key name
     */
    prefixKey(key) {
        return `${this.prefix}${key}`;
    }
};
LocalStorageDatabase.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [LS_PREFIX,] }] }
];
LocalStorageDatabase.ɵprov = i0.ɵɵdefineInjectable({ factory: function LocalStorageDatabase_Factory() { return new LocalStorageDatabase(i0.ɵɵinject(i1.LS_PREFIX)); }, token: LocalStorageDatabase, providedIn: "root" });
LocalStorageDatabase = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __param(0, Inject(LS_PREFIX))
], LocalStorageDatabase);
export { LocalStorageDatabase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxzdG9yYWdlLWRhdGFiYXNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1wd2EvbG9jYWwtc3RvcmFnZS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhYmFzZXMvbG9jYWxzdG9yYWdlLWRhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUczQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQzs7O0FBS3RDLElBQWEsb0JBQW9CLEdBQWpDLE1BQWEsb0JBQW9CO0lBTy9COzs7T0FHRztJQUNILFlBQ3FCLFNBQVMsRUFBRTtRQUc5Qiw2Q0FBNkM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLElBQUksRUFBRSxDQUFDO0lBRTdCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksSUFBSTtRQUVOLHNFQUFzRTtRQUN0RSxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFakMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxHQUFHLENBQWMsR0FBVztRQUUxQixrQkFBa0I7UUFDbEIsTUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFL0QsSUFBSSxVQUF5QixDQUFDO1FBRTlCLHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxFQUFFO1lBRTNELGtCQUFrQjtZ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RUFBRTtnQkFFeEMsc0VBQXNFO2dCQUN0RSxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUVqQjtTQUVGO1FBRUQsc0VBQXNFO1FBQ3RFLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRW5CLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sZ0JBQWdCLENBQUMsS0FBYTtRQUV0QywrQ0FBK0M7UUFDL0MsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1QyxJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7WUFFeEIsd0VBQXdFO1lBQ3hFLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUU1RTtRQUVELE9BQU8sSUFBSSxDQUFDO0lBRWQsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxTQUFTLENBQUMsR0FBVztRQUU3QixPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUVoQyxDQUFDO0NBRUYsQ0FBQTs7NENBak1JLE1BQU0sU0FBQyxTQUFTOzs7QUFaUixvQkFBb0I7SUFIaEMsVUFBVSxDQUFDO1FBQ1YsVUFBVSxFQUFFLE1BQU07S0FDbkIsQ0FBQztJQWFHLFdBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0dBWlQsb0JBQW9CLENBNk1oQztTQTdNWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCB0aHJvd0Vycm9yLCBhc3luY1NjaGVkdWxlciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgb2JzZXJ2ZU9uIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBMb2NhbERhdGFiYXNlIH0gZnJvbSAnLi9sb2NhbC1kYXRhYmFzZSc7XG5pbXBvcnQgeyBTZXJpYWxpemF0aW9uRXJyb3IgfSBmcm9tICcuL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHsgTFNfUFJFRklYIH0gZnJvbSAnLi4vdG9rZW5zJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTG9jYWxTdG9yYWdlRGF0YWJhc2UgaW1wbGVtZW50cyBMb2NhbERhdGFiYXNlIHtcblxuICAvKipcbiAgICogT3B0aW9uYWwgdXNlciBwcmVmaXggdG8gYXZvaWQgY29sbGlzaW9uIGZvciBtdWx0aXBsZSBhcHBzIG9uIHRoZSBzYW1lIHN1YmRvbWFpblxuICAgKi9cbiAgcmVhZG9ubHkgcHJlZml4OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIHBhcmFtcyBhcmUgcHJvdmlkZWQgYnkgQW5ndWxhciAoYnV0IGNhbiBhbHNvIGJlIHBhc3NlZCBtYW51YWxseSBpbiB0ZXN0cylcbiAgICogQHBhcmFtIHByZWZpeCBQcmVmaXggb3B0aW9uIHRvIGF2b2lkIGNvbGxpc2lvbiBmb3IgbXVsdGlwbGUgYXBwcyBvbiB0aGUgc2FtZSBzdWJkb21haW4gb3IgZm9yIGludGVyb3BlcmFiaWxpdHlcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoTFNfUFJFRklYKSBwcmVmaXggPSAnJyxcbiAgKSB7XG5cbiAgICAvKiBQcmVmaXggaWYgYXNrZWQsIG9yIG5vIHByZWZpeCBvdGhlcndpc2UgKi9cbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeCB8fCAnJztcblxuICB9XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiBpdGVtcyBpbiBgbG9jYWxTdG9yYWdlYFxuICAgKi9cbiAgZ2V0IHNpemUoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcblxuICAgIC8qIFdyYXAgaW4gYSBSeEpTIGBPYnNlcnZhYmxlYCB0byBiZSBjb25zaXN0ZW50IHdpdGggb3RoZXIgc3RvcmFnZXMgKi9cbiAgICByZXR1cm4gb2YobG9jYWxTdG9yYWdlLmxlbmd0aCk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIGl0ZW0gdmFsdWUgaW4gYGxvY2FsU3RvcmFnZWBcbiAgICogQHBhcmFtIGtleSBUaGUgaXRlbSdzIGtleVxuICAgKiBAcmV0dXJucyBUaGUgaXRlbSdzIHZhbHVlIGlmIHRoZSBrZXkgZXhpc3RzLCBgdW5kZWZpbmVkYCBvdGhlcndpc2UsIHdyYXBwZWQgaW4gYSBSeEpTIGBPYnNlcnZhYmxlYFxuICAgKi9cbiAgZ2V0PFQgPSB1bmtub3duPihrZXk6IHN0cmluZyk6IE9ic2VydmFibGU8VCB8IHVuZGVmaW5lZD4ge1xuXG4gICAgLyogR2V0IHJhdyBkYXRhICovXG4gICAgY29uc3QgdW5wYXJzZWREYXRhID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5wcmVmaXhLZXkoa2V5KSk7XG5cbiAgICBsZXQgcGFyc2VkRGF0YTogVCB8IHVuZGVmaW5lZDtcblxuICAgIC8qIE5vIG5lZWQgdG8gcGFyc2UgaWYgZGF0YSBpcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgKi9cbiAgICBpZiAoKHVucGFyc2VkRGF0YSAhPT0gdW5kZWZpbmVkKSAmJiAodW5wYXJzZWREYXRhICE9PSBudWxsKSkge1xuXG4gICAgICAvKiBUcnkgdG8gcGFyc2UgKi9cbiAgICAgIHRyeSB7XG4gICAgICAgIHBhcnNlZERhdGEgPSBKU09OLnBhcnNlKHVucGFyc2VkRGF0YSkgYXMgVDtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yIGFzIFN5bnRheEVycm9yKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIC8qIFdyYXAgaW4gYSBSeEpTIGBPYnNlcnZhYmxlYCB0byBiZSBjb25zaXN0ZW50IHdpdGggb3RoZXIgc3RvcmFnZXMgKi9cbiAgICByZXR1cm4gb2YocGFyc2VkRGF0YSk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZSBhbiBpdGVtIGluIGBsb2NhbFN0b3JhZ2VgXG4gICAqIEBwYXJhbSBrZXkgVGhlIGl0ZW0ncyBrZXlcbiAgICogQHBhcmFtIGRhdGEgVGhlIGl0ZW0ncyB2YWx1ZVxuICAgKiBAcmV0dXJucyBBIFJ4SlMgYE9ic2VydmFibGVgIHRvIHdhaXQgdGhlIGVuZCBvZiB0aGUgb3BlcmF0aW9uXG4gICAqL1xuICBzZXQoa2V5OiBzdHJpbmcsIGRhdGE6IHVua25vd24pOiBPYnNlcnZhYmxlPHVuZGVmaW5lZD4ge1xuXG4gICAgbGV0IHNlcmlhbGl6ZWREYXRhOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAgIC8qIENoZWNrIGlmIGRhdGEgY2FuIGJlIHNlcmlhbGl6ZWQgKi9cbiAgICBjb25zdCBkYXRhUHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGRhdGEpO1xuICAgIGlmICgodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSAmJiAoZGF0YSAhPT0gbnVsbCkgJiYgIUFycmF5LmlzQXJyYXkoZGF0YSkgJiZcbiAgICAhKChkYXRhUHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlKSB8fCAoZGF0YVByb3RvdHlwZSA9PT0gbnVsbCkpKSB7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcihuZXcgU2VyaWFsaXphdGlvbkVycm9yKCkpO1xuICAgIH1cblxuICAgIC8qIFRyeSB0byBzdHJpbmdpZnkgKGNhbiBmYWlsIG9uIGNpcmN1bGFyIHJlZmVyZW5jZXMpICovXG4gICAgdHJ5IHtcbiAgICAgIHNlcmlhbGl6ZWREYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yIGFzIFR5cGVFcnJvcik7XG4gICAgfVxuXG4gICAgLyogQ2FuIGZhaWwgaWYgc3RvcmFnZSBxdW90YSBpcyBleGNlZWRlZCAqL1xuICAgIHRyeSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnByZWZpeEtleShrZXkpLCBzZXJpYWxpemVkRGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yIGFzIERPTUV4Y2VwdGlvbik7XG4gICAgfVxuXG4gICAgLyogV3JhcCBpbiBhIFJ4SlMgYE9ic2VydmFibGVgIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBvdGhlciBzdG9yYWdlcyAqL1xuICAgIHJldHVybiBvZih1bmRlZmluZWQpO1xuXG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlcyBhbiBpdGVtIGluIGBsb2NhbFN0b3JhZ2VgXG4gICAqIEBwYXJhbSBrZXkgVGhlIGl0ZW0ncyBrZXlcbiAgICogQHJldHVybnMgQSBSeEpTIGBPYnNlcnZhYmxlYCB0byB3YWl0IHRoZSBlbmQgb2YgdGhlIG9wZXJhdGlvblxuICAgKi9cbiAgZGVsZXRlKGtleTogc3RyaW5nKTogT2JzZXJ2YWJsZTx1bmRlZmluZWQ+IHtcblxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMucHJlZml4S2V5KGtleSkpO1xuXG4gICAgLyogV3JhcCBpbiBhIFJ4SlMgYE9ic2VydmFibGVgIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBvdGhlciBzdG9yYWdlcyAqL1xuICAgIHJldHVybiBvZih1bmRlZmluZWQpO1xuXG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlcyBhbGwgaXRlbXMgaW4gYGxvY2FsU3RvcmFnZWBcbiAgICogQHJldHVybnMgQSBSeEpTIGBPYnNlcnZhYmxlYCB0byB3YWl0IHRoZSBlbmQgb2YgdGhlIG9wZXJhdGlvblxuICAgKi9cbiAgY2xlYXIoKTogT2JzZXJ2YWJsZTx1bmRlZmluZWQ+IHtcblxuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuXG4gICAgLyogV3JhcCBpbiBhIFJ4SlMgYE9ic2VydmFibGVgIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBvdGhlciBzdG9yYWdlcyAqL1xuICAgIHJldHVybiBvZih1bmRlZmluZWQpO1xuXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFsbCBrZXlzIGluIGBsb2NhbFN0b3JhZ2VgXG4gICAqIE5vdGUgdGhlIG9yZGVyIG9mIHRoZSBrZXlzIG1heSBiZSBpbmNvbnNpc3RlbnQgaW4gRmlyZWZveFxuICAgKiBAcmV0dXJucyBBIFJ4SlMgYE9ic2VydmFibGVgIGl0ZXJhdGluZyBvbiBrZXlzXG4gICAqL1xuICBrZXlzKCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG5cbiAgICAvKiBDcmVhdGUgYW4gYE9ic2VydmFibGVgIGZyb20ga2V5cyAqL1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxzdHJpbmc+KChzdWJzY3JpYmVyKSA9PiB7XG5cbiAgICAgIC8qIEl0ZXJldGF0ZSBvdmVyIGFsbCB0aGUgaW5kZXhlcyAqL1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGluZGV4ICs9IDEpIHtcblxuICAgICAgICAvKiBDYXN0IGFzIHdlIGFyZSBzdXJlIGluIHRoaXMgY2FzZSB0aGUga2V5IGlzIG5vdCBgbnVsbGAgKi9cbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KHRoaXMuZ2V0VW5wcmVmaXhlZEtleShpbmRleCkgYXMgc3RyaW5nKTtcblxuICAgICAgfVxuXG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG5cbiAgICB9KS5waXBlKFxuICAgICAgLyogUmVxdWlyZWQgdG8gd29yayBsaWtlIG90aGVyIGRhdGFiYXNlcyB3aGljaCBhcmUgYXN5bmNocm9ub3VzICovXG4gICAgICBvYnNlcnZlT24oYXN5bmNTY2hlZHVsZXIpLFxuICAgICk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIGtleSBleGlzdHMgaW4gYGxvY2FsU3RvcmFnZWBcbiAgICogQHBhcmFtIGtleSBUaGUgaXRlbSdzIGtleVxuICAgKiBAcmV0dXJucyBBIFJ4SlMgYE9ic2VydmFibGVgIHRlbGxpbmcgaWYgdGhlIGtleSBleGlzdHMgb3Igbm90XG4gICAqL1xuICBoYXMoa2V5OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcblxuICAgIC8qIEl0w6lyYXRlIG92ZXIgYWxsIGluZGV4ZXMgaW4gc3RvcmFnZSAqL1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyBpbmRleCArPSAxKSB7XG5cbiAgICAgIGlmIChrZXkgPT09IHRoaXMuZ2V0VW5wcmVmaXhlZEtleShpbmRleCkpwqB7XG5cbiAgICAgICAgLyogV3JhcCBpbiBhIFJ4SlMgYE9ic2VydmFibGVgIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBvdGhlciBzdG9yYWdlcyAqL1xuICAgICAgICByZXR1cm4gb2YodHJ1ZSk7XG5cbiAgICAgIH1cblxuICAgIH1cblxuICAgIC8qIFdyYXAgaW4gYSBSeEpTIGBPYnNlcnZhYmxlYCB0byBiZSBjb25zaXN0ZW50IHdpdGggb3RoZXIgc3RvcmFnZXMgKi9cbiAgICByZXR1cm4gb2YoZmFsc2UpO1xuXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIHVucHJlZml4ZWQga2V5XG4gICAqIEBwYXJhbSBpbmRleCBJbmRleCBvZiB0aGUga2V5XG4gICAqIEByZXR1cm5zIFRoZSB1bnByZWZpeGVkIGtleSBuYW1lIGlmIGV4aXN0cywgYG51bGxgIG90aGVyd2lzZVxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFVucHJlZml4ZWRLZXkoaW5kZXg6IG51bWJlcik6IHN0cmluZyB8IG51bGwge1xuXG4gICAgLyogR2V0IHRoZSBrZXkgaW4gc3RvcmFnZTogbWF5IGhhdmUgYSBwcmVmaXggKi9cbiAgICBjb25zdCBwcmVmaXhlZEtleSA9IGxvY2FsU3RvcmFnZS5rZXkoaW5kZXgpO1xuXG4gICAgaWYgKHByZWZpeGVkS2V5ICE9PSBudWxsKSB7XG5cbiAgICAgIC8qIElmIG5vIHByZWZpeCwgdGhlIGtleSBpcyBhbHJlYWR5IGdvb2QsIG90aGVyd3JpdGUgc3RyaXAgdGhlIHByZWZpeCAqL1xuICAgICAgcmV0dXJuICF0aGlzLnByZWZpeCA/IHByZWZpeGVkS2V5IDogcHJlZml4ZWRLZXkuc3Vic3RyKHRoaXMucHJlZml4Lmxlbmd0aCk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcblxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgcHJlZml4IHRvIGEga2V5XG4gICAqIEBwYXJhbSBrZXkgVGhlIGtleSBuYW1lXG4gICAqIEByZXR1cm5zIFRoZSBwcmVmaXhlZCBrZXkgbmFtZVxuICAgKi9cbiAgcHJvdGVjdGVkIHByZWZpeEtleShrZXk6IHN0cmluZyk6IHN0cmluZyB7XG5cbiAgICByZXR1cm4gYCR7dGhpcy5wcmVmaXh9JHtrZXl9YDtcblxuICB9XG5cbn1cbiJdfQ==