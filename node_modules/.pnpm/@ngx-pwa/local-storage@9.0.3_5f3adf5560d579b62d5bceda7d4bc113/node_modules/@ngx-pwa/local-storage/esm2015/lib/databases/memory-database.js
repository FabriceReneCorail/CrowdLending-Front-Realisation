import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { of, from } from 'rxjs';
import * as i0 from "@angular/core";
let MemoryDatabase = class MemoryDatabase {
    constructor() {
        /**
         * Memory storage
         */
        this.memoryStorage = new Map();
    }
    /**
     * Number of items in memory
     */
    get size() {
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(this.memoryStorage.size);
    }
    /**
     * Gets an item value in memory
     * @param key The item's key
     * @returns The item's value if the key exists, `undefined` otherwise, wrapped in a RxJS `Observable`
     */
    get(key) {
        const rawData = this.memoryStorage.get(key);
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(rawData);
    }
    /**
     * Sets an item in memory
     * @param key The item's key
     * @param data The item's value
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    set(key, data) {
        this.memoryStorage.set(key, data);
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(undefined);
    }
    /**
     * Deletes an item in memory
     * @param key The item's key
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    delete(key) {
        this.memoryStorage.delete(key);
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(undefined);
    }
    /**
     * Deletes all items in memory
     * @returns A RxJS `Observable` to wait the end of the operation
     */
    clear() {
        this.memoryStorage.clear();
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(undefined);
    }
    /**
     * Get all keys in memory
     * @returns A RxJS `Observable` iterating on keys
     */
    keys() {
        /* Create an `Observable` from keys */
        return from(this.memoryStorage.keys());
    }
    /**
     * Check if a key exists in memory
     * @param key Key name
     * @returns a RxJS `Observable` telling if the key exists or not
     */
    has(key) {
        /* Wrap in a RxJS `Observable` to be consistent with other storages */
        return of(this.memoryStorage.has(key));
    }
};
MemoryDatabase.ɵprov = i0.ɵɵdefineInjectable({ factory: function MemoryDatabase_Factory() { return new MemoryDatabase(); }, token: MemoryDatabase, providedIn: "root" });
MemoryDatabase = __decorate([
    Injectable({
        providedIn: 'root'
    })
], MemoryDatabase);
export { MemoryDatabase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtb3J5LWRhdGFiYXNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1wd2EvbG9jYWwtc3RvcmFnZS8iLCJzb3VyY2VzIjpbImxpYi9kYXRhYmFzZXMvbWVtb3J5LWRhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQU81QyxJQUFhLGNBQWMsR0FBM0IsTUFBYSxjQUFjO0lBQTNCO1FBRUU7O1dBRUc7UUFDTyxrQkFBYSxHQUFHLElBQUksR0FBRyxFQUFtQixDQUFDO0tBMkZ0RDtJQXpGQzs7T0FFRztJQUNILElBQUksSUFBSTtRQUVOLHNFQUFzRTtRQUN0RSxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXJDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0YsR0FBRyxDQUFjLEdBQVc7UUFFM0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFrQixDQUFDO1FBRTdELHNFQUFzRTtRQUN0RSxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVyQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDRixHQUFHLENBQUMsR0FBVyxFQUFFLElBQWE7UUFFN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWxDLHNFQUFzRTtRQUN0RSxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUV2QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNGLE1BQU0sQ0FBQyxHQUFXO1FBRWpCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRS9CLHNFQUFzRTtRQUN0RSxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUV2QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0YsS0FBSztRQUVKLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFM0Isc0VBQXNFO1FBQ3RFLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRXZCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJO1FBRUYsc0NBQXNDO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUV6QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEdBQUcsQ0FBQyxHQUFXO1FBRWIsc0VBQXNFO1FBQ3RFLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFekMsQ0FBQztDQUVGLENBQUE7O0FBaEdZLGNBQWM7SUFIMUIsVUFBVSxDQUFDO1FBQ1YsVUFBVSxFQUFFLE1BQU07S0FDbkIsQ0FBQztHQUNXLGNBQWMsQ0FnRzFCO1NBaEdZLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgZnJvbSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBMb2NhbERhdGFiYXNlIH0gZnJvbSAnLi9sb2NhbC1kYXRhYmFzZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE1lbW9yeURhdGFiYXNlIGltcGxlbWVudHMgTG9jYWxEYXRhYmFzZSB7XG5cbiAgLyoqXG4gICAqIE1lbW9yeSBzdG9yYWdlXG4gICAqL1xuICBwcm90ZWN0ZWQgbWVtb3J5U3RvcmFnZSA9IG5ldyBNYXA8c3RyaW5nLCB1bmtub3duPigpO1xuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgaXRlbXMgaW4gbWVtb3J5XG4gICAqL1xuICBnZXQgc2l6ZSgpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuXG4gICAgLyogV3JhcCBpbiBhIFJ4SlMgYE9ic2VydmFibGVgIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBvdGhlciBzdG9yYWdlcyAqL1xuICAgIHJldHVybiBvZih0aGlzLm1lbW9yeVN0b3JhZ2Uuc2l6ZSk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIGl0ZW0gdmFsdWUgaW4gbWVtb3J5XG4gICAqIEBwYXJhbSBrZXkgVGhlIGl0ZW0ncyBrZXlcbiAgICogQHJldHVybnMgVGhlIGl0ZW0ncyB2YWx1ZSBpZiB0aGUga2V5IGV4aXN0cywgYHVuZGVmaW5lZGAgb3RoZXJ3aXNlLCB3cmFwcGVkIGluIGEgUnhKUyBgT2JzZXJ2YWJsZWBcbiAgICovXG4gICBnZXQ8VCA9IHVua25vd24+KGtleTogc3RyaW5nKTogT2JzZXJ2YWJsZTxUIHwgdW5kZWZpbmVkPiB7XG5cbiAgICBjb25zdCByYXdEYXRhID0gdGhpcy5tZW1vcnlTdG9yYWdlLmdldChrZXkpIGFzIFQgfCB1bmRlZmluZWQ7XG5cbiAgICAvKiBXcmFwIGluIGEgUnhKUyBgT2JzZXJ2YWJsZWAgdG8gYmUgY29uc2lzdGVudCB3aXRoIG90aGVyIHN0b3JhZ2VzICovXG4gICAgcmV0dXJuIG9mKHJhd0RhdGEpO1xuXG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhbiBpdGVtIGluIG1lbW9yeVxuICAgKiBAcGFyYW0ga2V5IFRoZSBpdGVtJ3Mga2V5XG4gICAqIEBwYXJhbSBkYXRhIFRoZSBpdGVtJ3MgdmFsdWVcbiAgICogQHJldHVybnMgQSBSeEpTIGBPYnNlcnZhYmxlYCB0byB3YWl0IHRoZSBlbmQgb2YgdGhlIG9wZXJhdGlvblxuICAgKi9cbiAgIHNldChrZXk6IHN0cmluZywgZGF0YTogdW5rbm93bik6IE9ic2VydmFibGU8dW5kZWZpbmVkPiB7XG5cbiAgICB0aGlzLm1lbW9yeVN0b3JhZ2Uuc2V0KGtleSwgZGF0YSk7XG5cbiAgICAvKiBXcmFwIGluIGEgUnhKUyBgT2JzZXJ2YWJsZWAgdG8gYmUgY29uc2lzdGVudCB3aXRoIG90aGVyIHN0b3JhZ2VzICovXG4gICAgcmV0dXJuIG9mKHVuZGVmaW5lZCk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGFuIGl0ZW0gaW4gbWVtb3J5XG4gICAqIEBwYXJhbSBrZXkgVGhlIGl0ZW0ncyBrZXlcbiAgICogQHJldHVybnMgQSBSeEpTIGBPYnNlcnZhYmxlYCB0byB3YWl0IHRoZSBlbmQgb2YgdGhlIG9wZXJhdGlvblxuICAgKi9cbiAgIGRlbGV0ZShrZXk6IHN0cmluZyk6IE9ic2VydmFibGU8dW5kZWZpbmVkPiB7XG5cbiAgICB0aGlzLm1lbW9yeVN0b3JhZ2UuZGVsZXRlKGtleSk7XG5cbiAgICAvKiBXcmFwIGluIGEgUnhKUyBgT2JzZXJ2YWJsZWAgdG8gYmUgY29uc2lzdGVudCB3aXRoIG90aGVyIHN0b3JhZ2VzICovXG4gICAgcmV0dXJuIG9mKHVuZGVmaW5lZCk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGFsbCBpdGVtcyBpbiBtZW1vcnlcbiAgICogQHJldHVybnMgQSBSeEpTIGBPYnNlcnZhYmxlYCB0byB3YWl0IHRoZSBlbmQgb2YgdGhlIG9wZXJhdGlvblxuICAgKi9cbiAgIGNsZWFyKCk6IE9ic2VydmFibGU8dW5kZWZpbmVkPiB7XG5cbiAgICB0aGlzLm1lbW9yeVN0b3JhZ2UuY2xlYXIoKTtcblxuICAgIC8qIFdyYXAgaW4gYSBSeEpTIGBPYnNlcnZhYmxlYCB0byBiZSBjb25zaXN0ZW50IHdpdGggb3RoZXIgc3RvcmFnZXMgKi9cbiAgICByZXR1cm4gb2YodW5kZWZpbmVkKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwga2V5cyBpbiBtZW1vcnlcbiAgICogQHJldHVybnMgQSBSeEpTIGBPYnNlcnZhYmxlYCBpdGVyYXRpbmcgb24ga2V5c1xuICAgKi9cbiAga2V5cygpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuXG4gICAgLyogQ3JlYXRlIGFuIGBPYnNlcnZhYmxlYCBmcm9tIGtleXMgKi9cbiAgICByZXR1cm4gZnJvbSh0aGlzLm1lbW9yeVN0b3JhZ2Uua2V5cygpKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEga2V5IGV4aXN0cyBpbiBtZW1vcnlcbiAgICogQHBhcmFtIGtleSBLZXkgbmFtZVxuICAgKiBAcmV0dXJucyBhIFJ4SlMgYE9ic2VydmFibGVgIHRlbGxpbmcgaWYgdGhlIGtleSBleGlzdHMgb3Igbm90XG4gICAqL1xuICBoYXMoa2V5OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcblxuICAgIC8qIFdyYXAgaW4gYSBSeEpTIGBPYnNlcnZhYmxlYCB0byBiZSBjb25zaXN0ZW50IHdpdGggb3RoZXIgc3RvcmFnZXMgKi9cbiAgICByZXR1cm4gb2YodGhpcy5tZW1vcnlTdG9yYWdlLmhhcyhrZXkpKTtcblxuICB9XG5cbn1cbiJdfQ==