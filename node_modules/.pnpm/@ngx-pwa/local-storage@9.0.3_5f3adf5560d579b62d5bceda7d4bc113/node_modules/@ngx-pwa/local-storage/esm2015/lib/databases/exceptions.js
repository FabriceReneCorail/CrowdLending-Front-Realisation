/**
 * Exception message when `indexedDB` is not working
 */
export const IDB_BROKEN_ERROR = 'indexedDB is not working';
/**
 * Exception raised when `indexedDB` is not working
 */
export class IDBBrokenError extends Error {
    constructor() {
        super(...arguments);
        this.message = IDB_BROKEN_ERROR;
    }
}
/**
 * Exception message when a value can't be serialized for `localStorage`
 */
export const SERIALIZATION_ERROR = `The storage is currently localStorage,
where data must be serialized, and the provided data can't be serialized.`;
/**
 * Exception raised when a value can't be serialized for `localStorage`
 */
export class SerializationError extends Error {
    constructor() {
        super(...arguments);
        this.message = SERIALIZATION_ERROR;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtcHdhL2xvY2FsLXN0b3JhZ2UvIiwic291cmNlcyI6WyJsaWIvZGF0YWJhc2VzL2V4Y2VwdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRywwQkFBMEIsQ0FBQztBQUUzRDs7R0FFRztBQUNILE1BQU0sT0FBTyxjQUFlLFNBQVEsS0FBSztJQUF6Qzs7UUFDRSxZQUFPLEdBQUcsZ0JBQWdCLENBQUM7SUFDN0IsQ0FBQztDQUFBO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRzswRUFDdUMsQ0FBQztBQUUzRTs7R0FFRztBQUNILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxLQUFLO0lBQTdDOztRQUNFLFlBQU8sR0FBRyxtQkFBbUIsQ0FBQztJQUNoQyxDQUFDO0NBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEV4Y2VwdGlvbiBtZXNzYWdlIHdoZW4gYGluZGV4ZWREQmAgaXMgbm90IHdvcmtpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IElEQl9CUk9LRU5fRVJST1IgPSAnaW5kZXhlZERCIGlzIG5vdCB3b3JraW5nJztcblxuLyoqXG4gKiBFeGNlcHRpb24gcmFpc2VkIHdoZW4gYGluZGV4ZWREQmAgaXMgbm90IHdvcmtpbmdcbiAqL1xuZXhwb3J0IGNsYXNzIElEQkJyb2tlbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBtZXNzYWdlID0gSURCX0JST0tFTl9FUlJPUjtcbn1cblxuLyoqXG4gKiBFeGNlcHRpb24gbWVzc2FnZSB3aGVuIGEgdmFsdWUgY2FuJ3QgYmUgc2VyaWFsaXplZCBmb3IgYGxvY2FsU3RvcmFnZWBcbiAqL1xuZXhwb3J0IGNvbnN0IFNFUklBTElaQVRJT05fRVJST1IgPSBgVGhlIHN0b3JhZ2UgaXMgY3VycmVudGx5IGxvY2FsU3RvcmFnZSxcbndoZXJlIGRhdGEgbXVzdCBiZSBzZXJpYWxpemVkLCBhbmQgdGhlIHByb3ZpZGVkIGRhdGEgY2FuJ3QgYmUgc2VyaWFsaXplZC5gO1xuXG4vKipcbiAqIEV4Y2VwdGlvbiByYWlzZWQgd2hlbiBhIHZhbHVlIGNhbid0IGJlIHNlcmlhbGl6ZWQgZm9yIGBsb2NhbFN0b3JhZ2VgXG4gKi9cbmV4cG9ydCBjbGFzcyBTZXJpYWxpemF0aW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIG1lc3NhZ2UgPSBTRVJJQUxJWkFUSU9OX0VSUk9SO1xufVxuIl19