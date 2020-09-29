import { __extends } from "tslib";
/**
 * Exception message when `indexedDB` is not working
 */
export var IDB_BROKEN_ERROR = 'indexedDB is not working';
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
export { IDBBrokenError };
/**
 * Exception message when a value can't be serialized for `localStorage`
 */
export var SERIALIZATION_ERROR = "The storage is currently localStorage,\nwhere data must be serialized, and the provided data can't be serialized.";
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
export { SerializationError };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtcHdhL2xvY2FsLXN0b3JhZ2UvIiwic291cmNlcyI6WyJsaWIvZGF0YWJhc2VzL2V4Y2VwdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHO0FBQ0gsTUFBTSxDQUFDLElBQU0sZ0JBQWdCLEdBQUcsMEJBQTBCLENBQUM7QUFFM0Q7O0dBRUc7QUFDSDtJQUFvQyxrQ0FBSztJQUF6QztRQUFBLHFFQUVDO1FBREMsYUFBTyxHQUFHLGdCQUFnQixDQUFDOztJQUM3QixDQUFDO0lBQUQscUJBQUM7QUFBRCxDQUFDLEFBRkQsQ0FBb0MsS0FBSyxHQUV4Qzs7QUFFRDs7R0FFRztBQUNILE1BQU0sQ0FBQyxJQUFNLG1CQUFtQixHQUFHLG1IQUN1QyxDQUFDO0FBRTNFOztHQUVHO0FBQ0g7SUFBd0Msc0NBQUs7SUFBN0M7UUFBQSxxRUFFQztRQURDLGFBQU8sR0FBRyxtQkFBbUIsQ0FBQzs7SUFDaEMsQ0FBQztJQUFELHlCQUFDO0FBQUQsQ0FBQyxBQUZELENBQXdDLEtBQUssR0FFNUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEV4Y2VwdGlvbiBtZXNzYWdlIHdoZW4gYGluZGV4ZWREQmAgaXMgbm90IHdvcmtpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IElEQl9CUk9LRU5fRVJST1IgPSAnaW5kZXhlZERCIGlzIG5vdCB3b3JraW5nJztcblxuLyoqXG4gKiBFeGNlcHRpb24gcmFpc2VkIHdoZW4gYGluZGV4ZWREQmAgaXMgbm90IHdvcmtpbmdcbiAqL1xuZXhwb3J0IGNsYXNzIElEQkJyb2tlbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBtZXNzYWdlID0gSURCX0JST0tFTl9FUlJPUjtcbn1cblxuLyoqXG4gKiBFeGNlcHRpb24gbWVzc2FnZSB3aGVuIGEgdmFsdWUgY2FuJ3QgYmUgc2VyaWFsaXplZCBmb3IgYGxvY2FsU3RvcmFnZWBcbiAqL1xuZXhwb3J0IGNvbnN0IFNFUklBTElaQVRJT05fRVJST1IgPSBgVGhlIHN0b3JhZ2UgaXMgY3VycmVudGx5IGxvY2FsU3RvcmFnZSxcbndoZXJlIGRhdGEgbXVzdCBiZSBzZXJpYWxpemVkLCBhbmQgdGhlIHByb3ZpZGVkIGRhdGEgY2FuJ3QgYmUgc2VyaWFsaXplZC5gO1xuXG4vKipcbiAqIEV4Y2VwdGlvbiByYWlzZWQgd2hlbiBhIHZhbHVlIGNhbid0IGJlIHNlcmlhbGl6ZWQgZm9yIGBsb2NhbFN0b3JhZ2VgXG4gKi9cbmV4cG9ydCBjbGFzcyBTZXJpYWxpemF0aW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIG1lc3NhZ2UgPSBTRVJJQUxJWkFUSU9OX0VSUk9SO1xufVxuIl19