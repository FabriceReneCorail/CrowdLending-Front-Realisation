import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { mapTo, map } from 'rxjs/operators';
import { StorageMap } from './storage-map.service';
import * as i0 from "@angular/core";
import * as i1 from "./storage-map.service";
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
    LocalStorage.ɵprov = i0.ɵɵdefineInjectable({ factory: function LocalStorage_Factory() { return new LocalStorage(i0.ɵɵinject(i1.StorageMap)); }, token: LocalStorage, providedIn: "root" });
    LocalStorage = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], LocalStorage);
    return LocalStorage;
}());
export { LocalStorage };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWwtc3RvcmFnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1wd2EvbG9jYWwtc3RvcmFnZS8iLCJzb3VyY2VzIjpbImxpYi9zdG9yYWdlcy9sb2NhbC1zdG9yYWdlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7OztBQU1uRDtJQWdCRSw0REFBNEQ7SUFDNUQsc0JBQXNCLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7SUFBRyxDQUFDO0lBUGhELHNCQUFJLGdDQUFNO1FBUlY7Ozs7Ozs7V0FPRzthQUNIO1lBRUUsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztRQUU5QixDQUFDOzs7T0FBQTtJQWtERCw4QkFBTyxHQUFQLFVBQXFCLEdBQVcsRUFBRSxNQUF3RDtRQUV4RixJQUFJLE1BQU0sRUFBRTtZQUVWLDhDQUE4QztZQUM5QyxJQUFNLFdBQVcsR0FBZSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBRTlFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUksR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDLElBQUk7WUFDbEQsd0VBQXdFO1lBQ3hFLEdBQUcsQ0FBQyxVQUFDLEtBQUssSUFBSyxPQUFBLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBcEMsQ0FBb0MsQ0FBQyxDQUNyRCxDQUFDO1NBRUg7YUFBTTtZQUVMLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSTtZQUNsQyx3RUFBd0U7WUFDeEUsR0FBRyxDQUFDLFVBQUMsS0FBSyxJQUFLLE9BQUEsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFwQyxDQUFvQyxDQUFDLENBQ3JELENBQUM7U0FFSDtJQUVILENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0gsOEJBQU8sR0FBUCxVQUFRLEdBQVcsRUFBRSxJQUFhLEVBQUUsTUFBbUI7UUFFckQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUk7UUFDaEQsMEVBQTBFO1FBQzFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FDWixDQUFDO0lBRUosQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxpQ0FBVSxHQUFWLFVBQVcsR0FBVztRQUVwQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUk7UUFDckMsMEVBQTBFO1FBQzFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FDWixDQUFDO0lBRUosQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILDRCQUFLLEdBQUw7UUFFRSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSTtRQUNqQywwRUFBMEU7UUFDMUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUNaLENBQUM7SUFFSixDQUFDOztnQkF6SGlDLFVBQVU7OztJQWpCakMsWUFBWTtRQUh4QixVQUFVLENBQUM7WUFDVixVQUFVLEVBQUUsTUFBTTtTQUNuQixDQUFDO09BQ1csWUFBWSxDQTRJeEI7dUJBdEpEO0NBc0pDLEFBNUlELElBNElDO1NBNUlZLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXBUbywgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBTdG9yYWdlTWFwIH0gZnJvbSAnLi9zdG9yYWdlLW1hcC5zZXJ2aWNlJztcbmltcG9ydCB7IEpTT05TY2hlbWEsIEpTT05TY2hlbWFCb29sZWFuLCBKU09OU2NoZW1hSW50ZWdlciwgSlNPTlNjaGVtYU51bWJlciwgSlNPTlNjaGVtYVN0cmluZywgSlNPTlNjaGVtYUFycmF5T2YgfSBmcm9tICcuLi92YWxpZGF0aW9uJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTG9jYWxTdG9yYWdlIHtcblxuICAvKipcbiAgICogTnVtYmVyIG9mIGl0ZW1zIGluIHN0b3JhZ2Ugd3JhcHBlZCBpbiBhbiBgT2JzZXJ2YWJsZWBcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogdGhpcy5sb2NhbFN0b3JhZ2UubGVuZ3RoLnN1YnNjcmliZSgobGVuZ3RoKSA9PiB7XG4gICAqICAgY29uc29sZS5sb2cobGVuZ3RoKTtcbiAgICogfSk7XG4gICAqL1xuICBnZXQgbGVuZ3RoKCk6IE9ic2VydmFibGU8bnVtYmVyPiB7XG5cbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlTWFwLnNpemU7XG5cbiAgfVxuXG4gIC8qIFVzZSB0aGUgYFN0b3JhZ2VNYXBgIHNlcnZpY2UgdG8gYXZvaWQgY29kZSBkdXBsaWNhdGlvbiAqL1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc3RvcmFnZU1hcDogU3RvcmFnZU1hcCkge31cblxuICAvKipcbiAgICogR2V0IGFuIGl0ZW0gdmFsdWUgaW4gc3RvcmFnZS5cbiAgICogVGhlIHNpZ25hdHVyZSBoYXMgbWFueSBvdmVybG9hZHMgZHVlIHRvIHZhbGlkYXRpb24sICoqcGxlYXNlIHJlZmVyIHRvIHRoZSBkb2N1bWVudGF0aW9uLioqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9jeXJpbGxldHV6aS9hbmd1bGFyLWFzeW5jLWxvY2FsLXN0b3JhZ2UvYmxvYi9tYXN0ZXIvZG9jcy9WQUxJREFUSU9OLm1kfVxuICAgKiBAcGFyYW0ga2V5IFRoZSBpdGVtJ3Mga2V5XG4gICAqIEBwYXJhbSBzY2hlbWEgT3B0aW9uYWwgSlNPTiBzY2hlbWEgdG8gdmFsaWRhdGUgdGhlIGRhdGEuXG4gICAqICoqTm90ZSB5b3UgbXVzdCBwYXNzIHRoZSBzY2hlbWEgZGlyZWN0bHkgYXMgdGhlIHNlY29uZCBhcmd1bWVudC4qKlxuICAgKiAqKlBhc3NpbmcgdGhlIHNjaGVtYSBpbiBhbiBvYmplY3QgYHsgc2NoZW1hIH1gIGlzIGRlcHJlY2F0ZWQgYW5kIG9ubHkgaGVyZSoqXG4gICAqICoqZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHk6IGl0IHdpbGwgYmUgcmVtb3ZlZCBpbiBhIGZ1dHVyZSB2ZXJzaW9uLioqXG4gICAqIEByZXR1cm5zIFRoZSBpdGVtJ3MgdmFsdWUgaWYgdGhlIGtleSBleGlzdHMsIGBudWxsYCBvdGhlcndpc2UsIHdyYXBwZWQgaW4gYSBSeEpTIGBPYnNlcnZhYmxlYFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiB0aGlzLmxvY2FsU3RvcmFnZS5nZXQoJ2tleScsIHsgdHlwZTogJ3N0cmluZycgfSkuc3Vic2NyaWJlKChyZXN1bHQpID0+IHtcbiAgICogICByZXN1bHQ7IC8vIHN0cmluZyBvciBudWxsXG4gICAqIH0pO1xuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbnRlcmZhY2UgVXNlciB7XG4gICAqICAgZmlyc3ROYW1lOiBzdHJpbmc7XG4gICAqICAgbGFzdE5hbWU/OiBzdHJpbmc7XG4gICAqIH1cbiAgICpcbiAgICogY29uc3Qgc2NoZW1hID0ge1xuICAgKiAgIHR5cGU6ICdvYmplY3QnLFxuICAgKiAgIHByb3BlcnRpZXM6IHtcbiAgICogICAgIGZpcnN0TmFtZTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgKiAgICAgbGFzdE5hbWU6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICogICB9LFxuICAgKiAgIHJlcXVpcmVkOiBbJ2ZpcnN0TmFtZSddXG4gICAqIH07XG4gICAqXG4gICAqIHRoaXMubG9jYWxTdG9yYWdlLmdldDxVc2VyPigndXNlcicsIHNjaGVtYSkuc3Vic2NyaWJlKCh1c2VyKSA9PiB7XG4gICAqICAgaWYgKHVzZXIpIHtcbiAgICogICAgIHVzZXIuZmlyc3ROYW1lO1xuICAgKiAgIH1cbiAgICogfSk7XG4gICAqL1xuICBnZXRJdGVtPFQgPSBzdHJpbmc+KGtleTogc3RyaW5nLCBzY2hlbWE6IEpTT05TY2hlbWFTdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZyB8IG51bGw+O1xuICBnZXRJdGVtPFQgPSBudW1iZXI+KGtleTogc3RyaW5nLCBzY2hlbWE6IEpTT05TY2hlbWFJbnRlZ2VywqB8IEpTT05TY2hlbWFOdW1iZXIpOiBPYnNlcnZhYmxlPG51bWJlciB8IG51bGw+O1xuICBnZXRJdGVtPFQgPSBib29sZWFuPihrZXk6IHN0cmluZywgc2NoZW1hOiBKU09OU2NoZW1hQm9vbGVhbik6IE9ic2VydmFibGU8Ym9vbGVhbiB8IG51bGw+O1xuICBnZXRJdGVtPFQgPSBzdHJpbmdbXT4oa2V5OiBzdHJpbmcsIHNjaGVtYTogSlNPTlNjaGVtYUFycmF5T2Y8SlNPTlNjaGVtYVN0cmluZz4pOiBPYnNlcnZhYmxlPHN0cmluZ1tdIHwgbnVsbD47XG4gIGdldEl0ZW08VCA9IG51bWJlcltdPihrZXk6IHN0cmluZywgc2NoZW1hOiBKU09OU2NoZW1hQXJyYXlPZjxKU09OU2NoZW1hSW50ZWdlcsKgfCBKU09OU2NoZW1hTnVtYmVyPik6IE9ic2VydmFibGU8bnVtYmVyW10gfCBudWxsPjtcbiAgZ2V0SXRlbTxUID0gYm9vbGVhbltdPihrZXk6IHN0cmluZywgc2NoZW1hOiBKU09OU2NoZW1hQXJyYXlPZjxKU09OU2NoZW1hQm9vbGVhbj4pOiBPYnNlcnZhYmxlPGJvb2xlYW5bXSB8IG51bGw+O1xuICBnZXRJdGVtPFQgPSB1bmtub3duPihrZXk6IHN0cmluZywgc2NoZW1hOiBKU09OU2NoZW1hIHwgeyBzY2hlbWE6IEpTT05TY2hlbWEgfSk6IE9ic2VydmFibGU8VCB8IG51bGw+O1xuICBnZXRJdGVtPFQgPSB1bmtub3duPihrZXk6IHN0cmluZywgc2NoZW1hPzogSlNPTlNjaGVtYSk6IE9ic2VydmFibGU8dW5rbm93bj47XG4gIGdldEl0ZW08VCA9IHVua25vd24+KGtleTogc3RyaW5nLCBzY2hlbWE/OiBKU09OU2NoZW1hIHwgeyBzY2hlbWE6IEpTT05TY2hlbWEgfSB8IHVuZGVmaW5lZCk6IE9ic2VydmFibGU8dW5rbm93bj4ge1xuXG4gICAgaWYgKHNjaGVtYSkge1xuXG4gICAgICAvKiBCYWNrd2FyZCBjb21wYXRpYmlsaXR5IHdpdGggdmVyc2lvbiA8PSA3ICovXG4gICAgICBjb25zdCBzY2hlbWFGaW5hbDogSlNPTlNjaGVtYSA9ICgnc2NoZW1hJyBpbiBzY2hlbWEpID8gc2NoZW1hLnNjaGVtYSA6IHNjaGVtYTtcblxuICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZU1hcC5nZXQ8VD4oa2V5LCBzY2hlbWFGaW5hbCkucGlwZShcbiAgICAgICAgLyogVHJhbnNmb3JtIGB1bmRlZmluZWRgIGludG8gYG51bGxgIHRvIGFsaWduIHdpdGggYGxvY2FsU3RvcmFnZWAgQVBJICovXG4gICAgICAgIG1hcCgodmFsdWUpID0+ICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSA/IHZhbHVlIDogbnVsbCksXG4gICAgICApO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZU1hcC5nZXQoa2V5KS5waXBlKFxuICAgICAgICAvKiBUcmFuc2Zvcm0gYHVuZGVmaW5lZGAgaW50byBgbnVsbGAgdG8gYWxpZ24gd2l0aCBgbG9jYWxTdG9yYWdlYCBBUEkgKi9cbiAgICAgICAgbWFwKCh2YWx1ZSkgPT4gKHZhbHVlICE9PSB1bmRlZmluZWQpID8gdmFsdWUgOiBudWxsKSxcbiAgICAgICk7XG5cbiAgICB9XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYW4gaXRlbSBpbiBzdG9yYWdlLlxuICAgKiBOb3RlIHRoYXQgc2V0dGluZyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgd2lsbCByZW1vdmUgdGhlIGl0ZW0gdG8gYXZvaWQgc29tZSBicm93c2VycyBpc3N1ZXMuXG4gICAqIEBwYXJhbSBrZXkgVGhlIGl0ZW0ncyBrZXlcbiAgICogQHBhcmFtIGRhdGEgVGhlIGl0ZW0ncyB2YWx1ZVxuICAgKiBAcGFyYW0gc2NoZW1hIE9wdGlvbmFsIEpTT04gc2NoZW1hIHRvIHZhbGlkYXRlIHRoZSBkYXRhXG4gICAqIEByZXR1cm5zIEEgUnhKUyBgT2JzZXJ2YWJsZWAgdG8gd2FpdCB0aGUgZW5kIG9mIHRoZSBvcGVyYXRpb25cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogdGhpcy5sb2NhbFN0b3JhZ2Uuc2V0KCdrZXknLCAndmFsdWUnKS5zdWJzY3JpYmUoKCkgPT4ge30pO1xuICAgKi9cbiAgc2V0SXRlbShrZXk6IHN0cmluZywgZGF0YTogdW5rbm93biwgc2NoZW1hPzogSlNPTlNjaGVtYSk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuXG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZU1hcC5zZXQoa2V5LCBkYXRhLCBzY2hlbWEpLnBpcGUoXG4gICAgICAvKiBUcmFuc2Zvcm0gYHVuZGVmaW5lZGAgaW50byBgdHJ1ZWAgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aCB2NyAqL1xuICAgICAgbWFwVG8odHJ1ZSksXG4gICAgKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBhbiBpdGVtIGluIHN0b3JhZ2VcbiAgICogQHBhcmFtIGtleSBUaGUgaXRlbSdzIGtleVxuICAgKiBAcmV0dXJucyBBIFJ4SlMgYE9ic2VydmFibGVgIHRvIHdhaXQgdGhlIGVuZCBvZiB0aGUgb3BlcmF0aW9uXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZSgna2V5Jykuc3Vic2NyaWJlKCgpID0+IHt9KTtcbiAgICovXG4gIHJlbW92ZUl0ZW0oa2V5OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcblxuICAgIHJldHVybiB0aGlzLnN0b3JhZ2VNYXAuZGVsZXRlKGtleSkucGlwZShcbiAgICAgIC8qIFRyYW5zZm9ybSBgdW5kZWZpbmVkYCBpbnRvIGB0cnVlYCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoIHY3ICovXG4gICAgICBtYXBUbyh0cnVlKSxcbiAgICApO1xuXG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIGFsbCBpdGVtcyBpbiBzdG9yYWdlXG4gICAqIEByZXR1cm5zIEEgUnhKUyBgT2JzZXJ2YWJsZWAgdG8gd2FpdCB0aGUgZW5kIG9mIHRoZSBvcGVyYXRpb25cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogdGhpcy5sb2NhbFN0b3JhZ2UuY2xlYXIoKS5zdWJzY3JpYmUoKCkgPT4ge30pO1xuICAgKi9cbiAgY2xlYXIoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG5cbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlTWFwLmNsZWFyKCkucGlwZShcbiAgICAgIC8qIFRyYW5zZm9ybSBgdW5kZWZpbmVkYCBpbnRvIGB0cnVlYCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoIHY3ICovXG4gICAgICBtYXBUbyh0cnVlKSxcbiAgICApO1xuXG4gIH1cblxufVxuIl19