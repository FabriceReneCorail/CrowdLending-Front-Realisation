import { __extends } from "tslib";
/**
 * Exception message when a value is not valid against the JSON schema
 */
export var VALIDATION_ERROR = "Data stored is not valid against the provided JSON schema.\nCheck your JSON schema, otherwise it means data has been corrupted.";
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
export { ValidationError };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtcHdhL2xvY2FsLXN0b3JhZ2UvIiwic291cmNlcyI6WyJsaWIvc3RvcmFnZXMvZXhjZXB0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7QUFDSCxNQUFNLENBQUMsSUFBTSxnQkFBZ0IsR0FBRyxpSUFDb0MsQ0FBQztBQUVyRTs7R0FFRztBQUNIO0lBQXFDLG1DQUFLO0lBQTFDO1FBQUEscUVBRUM7UUFEQyxhQUFPLEdBQUcsZ0JBQWdCLENBQUM7O0lBQzdCLENBQUM7SUFBRCxzQkFBQztBQUFELENBQUMsQUFGRCxDQUFxQyxLQUFLLEdBRXpDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBFeGNlcHRpb24gbWVzc2FnZSB3aGVuIGEgdmFsdWUgaXMgbm90IHZhbGlkIGFnYWluc3QgdGhlIEpTT04gc2NoZW1hXG4gKi9cbmV4cG9ydCBjb25zdCBWQUxJREFUSU9OX0VSUk9SID0gYERhdGEgc3RvcmVkIGlzIG5vdCB2YWxpZCBhZ2FpbnN0IHRoZSBwcm92aWRlZCBKU09OIHNjaGVtYS5cbkNoZWNrIHlvdXIgSlNPTiBzY2hlbWEsIG90aGVyd2lzZSBpdCBtZWFucyBkYXRhIGhhcyBiZWVuIGNvcnJ1cHRlZC5gO1xuXG4vKipcbiAqIEV4Y2VwdGlvbiByYWlzZWQgd2hlbiBhIHZhbHVlIGlzIG5vdCB2YWxpZCBhZ2FpbnN0IHRoZSBKU09OIHNjaGVtYVxuICovXG5leHBvcnQgY2xhc3MgVmFsaWRhdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBtZXNzYWdlID0gVkFMSURBVElPTl9FUlJPUjtcbn1cbiJdfQ==