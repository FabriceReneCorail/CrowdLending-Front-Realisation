import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { mapTo, map } from 'rxjs/operators';
import { StorageMap } from './storage-map.service';
import * as i0 from "@angular/core";
import * as i1 from "./storage-map.service";
let LocalStorage = class LocalStorage {
    /* Use the `StorageMap` service to avoid code duplication */
    constructor(storageMap) {
        this.storageMap = storageMap;
    }
    /**
     * Number of items in storage wrapped in an `Observable`
     *
     * @example
     * this.localStorage.length.subscribe((length) => {
     *   console.log(length);
     * });
     */
    get length() {
        return this.storageMap.size;
    }
    getItem(key, schema) {
        if (schema) {
            /* Backward compatibility with version <= 7 */
            const schemaFinal = ('schema' in schema) ? schema.schema : schema;
            return this.storageMap.get(key, schemaFinal).pipe(
            /* Transform `undefined` into `null` to align with `localStorage` API */
            map((value) => (value !== undefined) ? value : null));
        }
        else {
            return this.storageMap.get(key).pipe(
            /* Transform `undefined` into `null` to align with `localStorage` API */
            map((value) => (value !== undefined) ? value : null));
        }
    }
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
    setItem(key, data, schema) {
        return this.storageMap.set(key, data, schema).pipe(
        /* Transform `undefined` into `true` for backward compatibility with v7 */
        mapTo(true));
    }
    /**
     * Delete an item in storage
     * @param key The item's key
     * @returns A RxJS `Observable` to wait the end of the operation
     *
     * @example
     * this.localStorage.delete('key').subscribe(() => {});
     */
    removeItem(key) {
        return this.storageMap.delete(key).pipe(
        /* Transform `undefined` into `true` for backward compatibility with v7 */
        mapTo(true));
    }
    /**
     * Delete all items in storage
     * @returns A RxJS `Observable` to wait the end of the operation
     *
     * @example
     * this.localStorage.clear().subscribe(() => {});
     */
    clear() {
        return this.storageMap.clear().pipe(
        /* Transform `undefined` into `true` for backward compatibility with v7 */
        mapTo(true));
    }
};
LocalStorage.ctorParameters = () => [
    { type: StorageMap }
];
LocalStorage.ɵprov = i0.ɵɵdefineInjectable({ factory: function LocalStorage_Factory() { return new LocalStorage(i0.ɵɵinject(i1.StorageMap)); }, token: LocalStorage, providedIn: "root" });
LocalStorage = __decorate([
    Injectable({
        providedIn: 'root'
    })
], LocalStorage);
export { LocalStorage };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWwtc3RvcmFnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1wd2EvbG9jYWwtc3RvcmFnZS8iLCJzb3VyY2VzIjpbImxpYi9zdG9yYWdlcy9sb2NhbC1zdG9yYWdlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7OztBQU1uRCxJQUFhLFlBQVksR0FBekIsTUFBYSxZQUFZO0lBZ0J2Qiw0REFBNEQ7SUFDNUQsWUFBc0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtJQUFHLENBQUM7SUFmaEQ7Ozs7Ozs7T0FPRztJQUNILElBQUksTUFBTTtRQUVSLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7SUFFOUIsQ0FBQztJQWtERCxPQUFPLENBQWMsR0FBVyxFQUFFLE1BQXdEO1FBRXhGLElBQUksTUFBTSxFQUFFO1lBRVYsOENBQThDO1lBQzlDLE1BQU0sV0FBVyxHQUFlLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFFOUUsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBSSxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUMsSUFBSTtZQUNsRCx3RUFBd0U7WUFDeEUsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDckQsQ0FBQztTQUVIO2FBQU07WUFFTCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUk7WUFDbEMsd0VBQXdFO1lBQ3hFLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ3JELENBQUM7U0FFSDtJQUVILENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0gsT0FBTyxDQUFDLEdBQVcsRUFBRSxJQUFhLEVBQUUsTUFBbUI7UUFFckQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUk7UUFDaEQsMEVBQTBFO1FBQzFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FDWixDQUFDO0lBRUosQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxVQUFVLENBQUMsR0FBVztRQUVwQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUk7UUFDckMsMEVBQTBFO1FBQzFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FDWixDQUFDO0lBRUosQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILEtBQUs7UUFFSCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSTtRQUNqQywwRUFBMEU7UUFDMUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUNaLENBQUM7SUFFSixDQUFDO0NBRUYsQ0FBQTs7WUEzSG1DLFVBQVU7OztBQWpCakMsWUFBWTtJQUh4QixVQUFVLENBQUM7UUFDVixVQUFVLEVBQUUsTUFBTTtLQUNuQixDQUFDO0dBQ1csWUFBWSxDQTRJeEI7U0E1SVksWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcFRvLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFN0b3JhZ2VNYXAgfSBmcm9tICcuL3N0b3JhZ2UtbWFwLnNlcnZpY2UnO1xuaW1wb3J0IHsgSlNPTlNjaGVtYSwgSlNPTlNjaGVtYUJvb2xlYW4sIEpTT05TY2hlbWFJbnRlZ2VyLCBKU09OU2NoZW1hTnVtYmVyLCBKU09OU2NoZW1hU3RyaW5nLCBKU09OU2NoZW1hQXJyYXlPZiB9IGZyb20gJy4uL3ZhbGlkYXRpb24nO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2Uge1xuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgaXRlbXMgaW4gc3RvcmFnZSB3cmFwcGVkIGluIGFuIGBPYnNlcnZhYmxlYFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiB0aGlzLmxvY2FsU3RvcmFnZS5sZW5ndGguc3Vic2NyaWJlKChsZW5ndGgpID0+IHtcbiAgICogICBjb25zb2xlLmxvZyhsZW5ndGgpO1xuICAgKiB9KTtcbiAgICovXG4gIGdldCBsZW5ndGgoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcblxuICAgIHJldHVybiB0aGlzLnN0b3JhZ2VNYXAuc2l6ZTtcblxuICB9XG5cbiAgLyogVXNlIHRoZSBgU3RvcmFnZU1hcGAgc2VydmljZSB0byBhdm9pZCBjb2RlIGR1cGxpY2F0aW9uICovXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzdG9yYWdlTWFwOiBTdG9yYWdlTWFwKSB7fVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gaXRlbSB2YWx1ZSBpbiBzdG9yYWdlLlxuICAgKiBUaGUgc2lnbmF0dXJlIGhhcyBtYW55IG92ZXJsb2FkcyBkdWUgdG8gdmFsaWRhdGlvbiwgKipwbGVhc2UgcmVmZXIgdG8gdGhlIGRvY3VtZW50YXRpb24uKipcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2N5cmlsbGV0dXppL2FuZ3VsYXItYXN5bmMtbG9jYWwtc3RvcmFnZS9ibG9iL21hc3Rlci9kb2NzL1ZBTElEQVRJT04ubWR9XG4gICAqIEBwYXJhbSBrZXkgVGhlIGl0ZW0ncyBrZXlcbiAgICogQHBhcmFtIHNjaGVtYSBPcHRpb25hbCBKU09OIHNjaGVtYSB0byB2YWxpZGF0ZSB0aGUgZGF0YS5cbiAgICogKipOb3RlIHlvdSBtdXN0IHBhc3MgdGhlIHNjaGVtYSBkaXJlY3RseSBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50LioqXG4gICAqICoqUGFzc2luZyB0aGUgc2NoZW1hIGluIGFuIG9iamVjdCBgeyBzY2hlbWEgfWAgaXMgZGVwcmVjYXRlZCBhbmQgb25seSBoZXJlKipcbiAgICogKipmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eTogaXQgd2lsbCBiZSByZW1vdmVkIGluIGEgZnV0dXJlIHZlcnNpb24uKipcbiAgICogQHJldHVybnMgVGhlIGl0ZW0ncyB2YWx1ZSBpZiB0aGUga2V5IGV4aXN0cywgYG51bGxgIG90aGVyd2lzZSwgd3JhcHBlZCBpbiBhIFJ4SlMgYE9ic2VydmFibGVgXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIHRoaXMubG9jYWxTdG9yYWdlLmdldCgna2V5JywgeyB0eXBlOiAnc3RyaW5nJyB9KS5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xuICAgKiAgIHJlc3VsdDsgLy8gc3RyaW5nIG9yIG51bGxcbiAgICogfSk7XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGludGVyZmFjZSBVc2VyIHtcbiAgICogICBmaXJzdE5hbWU6IHN0cmluZztcbiAgICogICBsYXN0TmFtZT86IHN0cmluZztcbiAgICogfVxuICAgKlxuICAgKiBjb25zdCBzY2hlbWEgPSB7XG4gICAqICAgdHlwZTogJ29iamVjdCcsXG4gICAqICAgcHJvcGVydGllczoge1xuICAgKiAgICAgZmlyc3ROYW1lOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAqICAgICBsYXN0TmFtZTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgKiAgIH0sXG4gICAqICAgcmVxdWlyZWQ6IFsnZmlyc3ROYW1lJ11cbiAgICogfTtcbiAgICpcbiAgICogdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0PFVzZXI+KCd1c2VyJywgc2NoZW1hKS5zdWJzY3JpYmUoKHVzZXIpID0+IHtcbiAgICogICBpZiAodXNlcikge1xuICAgKiAgICAgdXNlci5maXJzdE5hbWU7XG4gICAqICAgfVxuICAgKiB9KTtcbiAgICovXG4gIGdldEl0ZW08VCA9IHN0cmluZz4oa2V5OiBzdHJpbmcsIHNjaGVtYTogSlNPTlNjaGVtYVN0cmluZyk6IE9ic2VydmFibGU8c3RyaW5nIHwgbnVsbD47XG4gIGdldEl0ZW08VCA9IG51bWJlcj4oa2V5OiBzdHJpbmcsIHNjaGVtYTogSlNPTlNjaGVtYUludGVnZXLCoHwgSlNPTlNjaGVtYU51bWJlcik6IE9ic2VydmFibGU8bnVtYmVyIHwgbnVsbD47XG4gIGdldEl0ZW08VCA9IGJvb2xlYW4+KGtleTogc3RyaW5nLCBzY2hlbWE6IEpTT05TY2hlbWFCb29sZWFuKTogT2JzZXJ2YWJsZTxib29sZWFuIHwgbnVsbD47XG4gIGdldEl0ZW08VCA9IHN0cmluZ1tdPihrZXk6IHN0cmluZywgc2NoZW1hOiBKU09OU2NoZW1hQXJyYXlPZjxKU09OU2NoZW1hU3RyaW5nPik6IE9ic2VydmFibGU8c3RyaW5nW10gfCBudWxsPjtcbiAgZ2V0SXRlbTxUID0gbnVtYmVyW10+KGtleTogc3RyaW5nLCBzY2hlbWE6IEpTT05TY2hlbWFBcnJheU9mPEpTT05TY2hlbWFJbnRlZ2VywqB8IEpTT05TY2hlbWFOdW1iZXI+KTogT2JzZXJ2YWJsZTxudW1iZXJbXSB8IG51bGw+O1xuICBnZXRJdGVtPFQgPSBib29sZWFuW10+KGtleTogc3RyaW5nLCBzY2hlbWE6IEpTT05TY2hlbWFBcnJheU9mPEpTT05TY2hlbWFCb29sZWFuPik6IE9ic2VydmFibGU8Ym9vbGVhbltdIHwgbnVsbD47XG4gIGdldEl0ZW08VCA9IHVua25vd24+KGtleTogc3RyaW5nLCBzY2hlbWE6IEpTT05TY2hlbWEgfCB7IHNjaGVtYTogSlNPTlNjaGVtYSB9KTogT2JzZXJ2YWJsZTxUIHwgbnVsbD47XG4gIGdldEl0ZW08VCA9IHVua25vd24+KGtleTogc3RyaW5nLCBzY2hlbWE/OiBKU09OU2NoZW1hKTogT2JzZXJ2YWJsZTx1bmtub3duPjtcbiAgZ2V0SXRlbTxUID0gdW5rbm93bj4oa2V5OiBzdHJpbmcsIHNjaGVtYT86IEpTT05TY2hlbWEgfCB7IHNjaGVtYTogSlNPTlNjaGVtYSB9IHwgdW5kZWZpbmVkKTogT2JzZXJ2YWJsZTx1bmtub3duPiB7XG5cbiAgICBpZiAoc2NoZW1hKSB7XG5cbiAgICAgIC8qIEJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aCB2ZXJzaW9uIDw9IDcgKi9cbiAgICAgIGNvbnN0IHNjaGVtYUZpbmFsOiBKU09OU2NoZW1hID0gKCdzY2hlbWEnIGluIHNjaGVtYSkgPyBzY2hlbWEuc2NoZW1hIDogc2NoZW1hO1xuXG4gICAgICByZXR1cm4gdGhpcy5zdG9yYWdlTWFwLmdldDxUPihrZXksIHNjaGVtYUZpbmFsKS5waXBlKFxuICAgICAgICAvKiBUcmFuc2Zvcm0gYHVuZGVmaW5lZGAgaW50byBgbnVsbGAgdG8gYWxpZ24gd2l0aCBgbG9jYWxTdG9yYWdlYCBBUEkgKi9cbiAgICAgICAgbWFwKCh2YWx1ZSkgPT4gKHZhbHVlICE9PSB1bmRlZmluZWQpID8gdmFsdWUgOiBudWxsKSxcbiAgICAgICk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICByZXR1cm4gdGhpcy5zdG9yYWdlTWFwLmdldChrZXkpLnBpcGUoXG4gICAgICAgIC8qIFRyYW5zZm9ybSBgdW5kZWZpbmVkYCBpbnRvIGBudWxsYCB0byBhbGlnbiB3aXRoIGBsb2NhbFN0b3JhZ2VgIEFQSSAqL1xuICAgICAgICBtYXAoKHZhbHVlKSA9PiAodmFsdWUgIT09IHVuZGVmaW5lZCkgPyB2YWx1ZSA6IG51bGwpLFxuICAgICAgKTtcblxuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIFNldCBhbiBpdGVtIGluIHN0b3JhZ2UuXG4gICAqIE5vdGUgdGhhdCBzZXR0aW5nIGBudWxsYCBvciBgdW5kZWZpbmVkYCB3aWxsIHJlbW92ZSB0aGUgaXRlbSB0byBhdm9pZCBzb21lIGJyb3dzZXJzIGlzc3Vlcy5cbiAgICogQHBhcmFtIGtleSBUaGUgaXRlbSdzIGtleVxuICAgKiBAcGFyYW0gZGF0YSBUaGUgaXRlbSdzIHZhbHVlXG4gICAqIEBwYXJhbSBzY2hlbWEgT3B0aW9uYWwgSlNPTiBzY2hlbWEgdG8gdmFsaWRhdGUgdGhlIGRhdGFcbiAgICogQHJldHVybnMgQSBSeEpTIGBPYnNlcnZhYmxlYCB0byB3YWl0IHRoZSBlbmQgb2YgdGhlIG9wZXJhdGlvblxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiB0aGlzLmxvY2FsU3RvcmFnZS5zZXQoJ2tleScsICd2YWx1ZScpLnN1YnNjcmliZSgoKSA9PiB7fSk7XG4gICAqL1xuICBzZXRJdGVtKGtleTogc3RyaW5nLCBkYXRhOiB1bmtub3duLCBzY2hlbWE/OiBKU09OU2NoZW1hKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG5cbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlTWFwLnNldChrZXksIGRhdGEsIHNjaGVtYSkucGlwZShcbiAgICAgIC8qIFRyYW5zZm9ybSBgdW5kZWZpbmVkYCBpbnRvIGB0cnVlYCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoIHY3ICovXG4gICAgICBtYXBUbyh0cnVlKSxcbiAgICApO1xuXG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIGFuIGl0ZW0gaW4gc3RvcmFnZVxuICAgKiBAcGFyYW0ga2V5IFRoZSBpdGVtJ3Mga2V5XG4gICAqIEByZXR1cm5zIEEgUnhKUyBgT2JzZXJ2YWJsZWAgdG8gd2FpdCB0aGUgZW5kIG9mIHRoZSBvcGVyYXRpb25cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogdGhpcy5sb2NhbFN0b3JhZ2UuZGVsZXRlKCdrZXknKS5zdWJzY3JpYmUoKCkgPT4ge30pO1xuICAgKi9cbiAgcmVtb3ZlSXRlbShrZXk6IHN0cmluZyk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuXG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZU1hcC5kZWxldGUoa2V5KS5waXBlKFxuICAgICAgLyogVHJhbnNmb3JtIGB1bmRlZmluZWRgIGludG8gYHRydWVgIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IHdpdGggdjcgKi9cbiAgICAgIG1hcFRvKHRydWUpLFxuICAgICk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgYWxsIGl0ZW1zIGluIHN0b3JhZ2VcbiAgICogQHJldHVybnMgQSBSeEpTIGBPYnNlcnZhYmxlYCB0byB3YWl0IHRoZSBlbmQgb2YgdGhlIG9wZXJhdGlvblxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiB0aGlzLmxvY2FsU3RvcmFnZS5jbGVhcigpLnN1YnNjcmliZSgoKSA9PiB7fSk7XG4gICAqL1xuICBjbGVhcigpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcblxuICAgIHJldHVybiB0aGlzLnN0b3JhZ2VNYXAuY2xlYXIoKS5waXBlKFxuICAgICAgLyogVHJhbnNmb3JtIGB1bmRlZmluZWRgIGludG8gYHRydWVgIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IHdpdGggdjcgKi9cbiAgICAgIG1hcFRvKHRydWUpLFxuICAgICk7XG5cbiAgfVxuXG59XG4iXX0=