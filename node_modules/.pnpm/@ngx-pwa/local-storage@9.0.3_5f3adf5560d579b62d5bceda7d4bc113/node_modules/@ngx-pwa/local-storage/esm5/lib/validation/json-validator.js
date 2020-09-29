import { __decorate, __values } from "tslib";
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
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
    JSONValidator.ɵprov = i0.ɵɵdefineInjectable({ factory: function JSONValidator_Factory() { return new JSONValidator(); }, token: JSONValidator, providedIn: "root" });
    JSONValidator = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], JSONValidator);
    return JSONValidator;
}());
export { JSONValidator };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi12YWxpZGF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LXB3YS9sb2NhbC1zdG9yYWdlLyIsInNvdXJjZXMiOlsibGliL3ZhbGlkYXRpb24vanNvbi12YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBTTNDLGlDQUFpQztBQUlqQztJQUFBO0tBcVRDO0lBblRDOzs7Ozs7O09BT0c7SUFDSCxnQ0FBUSxHQUFSLFVBQVMsSUFBYSxFQUFFLE1BQWtCO1FBRXhDLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRTtZQUVuQixLQUFLLFFBQVE7Z0JBQ1gsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzQyxLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssU0FBUztnQkFDWixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzNDLEtBQUssU0FBUztnQkFDWixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzVDLEtBQUssT0FBTztnQkFDVixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzFDLEtBQUssUUFBUTtnQkFDWCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBRTVDO0lBRUgsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sc0NBQWMsR0FBeEIsVUFBeUIsSUFBYSxFQUFFLE1BQXdCO1FBRTlELElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQzVCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDckMsT0FBTyxLQUFLLENB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QUFNO1NBQ25CLENBQUM7T0FDVyxhQUFhLENBcVR6Qjt3QkEvVEQ7Q0ErVEMsQUFyVEQsSUFxVEM7U0FyVFksYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEpTT05TY2hlbWEsIEpTT05TY2hlbWFTdHJpbmcsIEpTT05TY2hlbWFJbnRlZ2VyLCBKU09OU2NoZW1hTnVtYmVyLCBKU09OU2NoZW1hQm9vbGVhbixcbiAgSlNPTlNjaGVtYUFycmF5LCBKU09OU2NoZW1hT2JqZWN0XG59IGZyb20gJy4vanNvbi1zY2hlbWEnO1xuXG4vLyBUT0RPOiBkZXRhaWxlZCBlcnJvciBtZXNzYWdlcz9cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEpTT05WYWxpZGF0b3Ige1xuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBhIEpTT04gZGF0YSBhZ2FpbnN0IGEgSnN1YnNldCBvZiB0aGUgSlNPTiBTY2hlbWEgc3RhbmRhcmQuXG4gICAqIFR5cGVzIGFyZSBlbmZvcmNlZCB0byB2YWxpZGF0ZSBldmVyeXRoaW5nOiBlYWNoIHNjaGVtYSBtdXN0XG4gICAqIEBwYXJhbSBkYXRhIEpTT04gZGF0YSB0byB2YWxpZGF0ZVxuICAgKiBAcGFyYW0gc2NoZW1hIFN1YnNldCBvZiBKU09OIFNjaGVtYS4gTXVzdCBoYXZlIGEgYHR5cGVgLlxuICAgKiBAcmV0dXJucyBJZiBkYXRhIGlzIHZhbGlkOiBgdHJ1ZWAsIGlmIGl0IGlzIGludmFsaWQ6IGBmYWxzZWBcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2N5cmlsbGV0dXppL2FuZ3VsYXItYXN5bmMtbG9jYWwtc3RvcmFnZS9ibG9iL21hc3Rlci9kb2NzL1ZBTElEQVRJT04ubWR9XG4gICAqL1xuICB2YWxpZGF0ZShkYXRhOiB1bmtub3duLCBzY2hlbWE6IEpTT05TY2hlbWEpOiBib29sZWFuIHtcblxuICAgIHN3aXRjaCAoc2NoZW1hLnR5cGUpIHtcblxuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVTdHJpbmcoZGF0YSwgc2NoZW1hKTtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICBjYXNlICdpbnRlZ2VyJzpcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVOdW1iZXIoZGF0YSwgc2NoZW1hKTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZUJvb2xlYW4oZGF0YSwgc2NoZW1hKTtcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVBcnJheShkYXRhLCBzY2hlbWEpO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVPYmplY3QoZGF0YSwgc2NoZW1hKTtcblxuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGEgc3RyaW5nXG4gICAqIEBwYXJhbSBkYXRhIERhdGEgdG8gdmFsaWRhdGVcbiAgICogQHBhcmFtIHNjaGVtYSBTY2hlbWEgZGVzY3JpYmluZyB0aGUgc3RyaW5nXG4gICAqIEByZXR1cm5zIElmIGRhdGEgaXMgdmFsaWQ6IGB0cnVlYCwgaWYgaXQgaXMgaW52YWxpZDogYGZhbHNlYFxuICAgKi9cbiAgcHJvdGVjdGVkIHZhbGlkYXRlU3RyaW5nKGRhdGE6IHVua25vd24sIHNjaGVtYTogSlNPTlNjaGVtYVN0cmluZyk6IGJvb2xlYW4ge1xuXG4gICAgaWYgKHR5cGVvZiBkYXRhICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghdGhpcy52YWxpZGF0ZUNvbnN0KGRhdGEsIHNjaGVtYSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMudmFsaWRhdGVFbnVtKGRhdGEsIHNjaGVtYSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoKHNjaGVtYS5tYXhMZW5ndGggIT09IHVuZGVmaW5lZCkgJiYgKGRhdGEubGVuZ3RoID4gc2NoZW1hLm1heExlbmd0aCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoKHNjaGVtYS5taW5MZW5ndGggIT09IHVuZGVmaW5lZCkgJiYgKGRhdGEubGVuZ3RoIDwgc2NoZW1hLm1pbkxlbmd0aCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoc2NoZW1hLnBhdHRlcm4pIHtcblxuICAgICAgbGV0IHJlZ3VsYXJFeHByZXNzaW9uOiBSZWdFeHAgfCBudWxsID0gbnVsbDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVndWxhckV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKHNjaGVtYS5wYXR0ZXJuKTtcbiAgICAgIH0gY2F0Y2gge31cblxuICAgICAgaWYgKHJlZ3VsYXJFeHByZXNzaW9uICYmICFyZWd1bGFyRXhwcmVzc2lvbi50ZXN0KGRhdGEpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuXG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgYSBudW1iZXIgb3IgYW4gaW50ZWdlclxuICAgKiBAcGFyYW0gZGF0YSBEYXRhIHRvIHZhbGlkYXRlXG4gICAqIEBwYXJhbSBzY2hlbWEgU2NoZW1hIGRlc2NyaWJpbmcgdGhlIG51bWJlciBvciBpbnRlZ2VyXG4gICAqIEByZXR1cm5zIElmIGRhdGEgaXMgdmFsaWQ6IGB0cnVlYCwgaWYgaXQgaXMgaW52YWxpZDogYGZhbHNlYFxuICAgKi9cbiAgcHJvdGVjdGVkIHZhbGlkYXRlTnVtYmVyKGRhdGE6IHVua25vd24sIHNjaGVtYTogSlNPTlNjaGVtYU51bWJlciB8wqBKU09OU2NoZW1hSW50ZWdlcik6IGJvb2xlYW4ge1xuXG4gICAgaWYgKHR5cGVvZiBkYXRhICE9PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICgoc2NoZW1hLnR5cGUgPT09ICdpbnRlZ2VyJykgJiYgIU51bWJlci5pc0ludGVnZXIoZGF0YSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMudmFsaWRhdGVDb25zdChkYXRhLCBzY2hlbWEpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnZhbGlkYXRlRW51bShkYXRhLCBzY2hlbWEpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyogVGVzdCBpcyBkb25lIHRoaXMgd2F5IHRvIG5vdCBkaXZpZGUgYnkgMCAqL1xuICAgIGlmIChzY2hlbWEubXVsdGlwbGVPZiAmJiAhTnVtYmVyLmlzSW50ZWdlcihkYXRhIC8gc2NoZW1hLm11bHRpcGxlT2YpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKChzY2hlbWEubWF4aW11bSAhPT0gdW5kZWZpbmVkKSAmJiAoZGF0YSA+IHNjaGVtYS5tYXhpbXVtKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKChzY2hlbWEuZXhjbHVzaXZlTWF4aW11bSAhPT0gdW5kZWZpbmVkKSAmJiAoZGF0YSA+PSBzY2hlbWEuZXhjbHVzaXZlTWF4aW11bSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIH1cblxuICAgIGlmICgoc2NoZW1hLm1pbmltdW0gIT09IHVuZGVmaW5lZCkgJiYgKGRhdGEgPCBzY2hlbWEubWluaW11bSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIH1cblxuICAgIGlmICgoc2NoZW1hLmV4Y2x1c2l2ZU1pbmltdW0gIT09IHVuZGVmaW5lZCkgJiYgKGRhdGEgPD0gc2NoZW1hLmV4Y2x1c2l2ZU1pbmltdW0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGEgYm9vbGVhblxuICAgKiBAcGFyYW0gZGF0YSBEYXRhIHRvIHZhbGlkYXRlXG4gICAqIEBwYXJhbSBzY2hlbWEgU2NoZW1hIGRlc2NyaWJpbmcgdGhlIGJvb2xlYW5cbiAgICogQHJldHVybnMgSWYgZGF0YSBpcyB2YWxpZDogYHRydWVgLCBpZiBpdCBpcyBpbnZhbGlkOiBgZmFsc2VgXG4gICAqL1xuICBwcm90ZWN0ZWQgdmFsaWRhdGVCb29sZWFuKGRhdGE6IHVua25vd24sIHNjaGVtYTogSlNPTlNjaGVtYUJvb2xlYW4pOiBib29sZWFuIHtcblxuICAgIGlmICh0eXBlb2YgZGF0YSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnZhbGlkYXRlQ29uc3QoZGF0YSwgc2NoZW1hKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuXG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgYW4gYXJyYXlcbiAgICogQHBhcmFtIGRhdGEgRGF0YSB0byB2YWxpZGF0ZVxuICAgKiBAcGFyYW0gc2NoZW1hIFNjaGVtYSBkZXNjcmliaW5nIHRoZSBhcnJheVxuICAgKiBAcmV0dXJucyBJZiBkYXRhIGlzIHZhbGlkOiBgdHJ1ZWAsIGlmIGl0IGlzIGludmFsaWQ6IGBmYWxzZWBcbiAgICovXG4gIHByb3RlY3RlZCB2YWxpZGF0ZUFycmF5KGRhdGE6IHVua25vd24sIHNjaGVtYTogSlNPTlNjaGVtYUFycmF5KTogYm9vbGVhbiB7XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoKHNjaGVtYS5tYXhJdGVtcyAhPT0gdW5kZWZpbmVkKSAmJiAoZGF0YS5sZW5ndGggPiBzY2hlbWEubWF4SXRlbXMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKChzY2hlbWEubWluSXRlbXMgIT09IHVuZGVmaW5lZCkgJiYgKGRhdGEubGVuZ3RoIDwgc2NoZW1hLm1pbkl0ZW1zKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChzY2hlbWEudW5pcXVlSXRlbXMpIHtcblxuICAgICAgLyogQ3JlYXRlIGEgc2V0IHRvIGVsaW1pbmF0ZSB2YWx1ZXMgd2l0aCBtdWx0aXBsZSBvY2N1cmVuY2VzICovXG4gICAgICBjb25zdCBkYXRhU2V0ID0gbmV3IFNldChkYXRhKTtcblxuICAgICAgaWYgKGRhdGEubGVuZ3RoICE9PSBkYXRhU2V0LnNpemUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyogU3BlY2lmaWMgdGVzdCBmb3IgdHVwbGVzICovXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc2NoZW1hLml0ZW1zKSkge1xuXG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZVR1cGxlKGRhdGEsIHNjaGVtYS5pdGVtcyk7XG5cbiAgICB9XG5cbiAgICAvKiBWYWxpZGF0ZSBhbGwgdGhlIHZhbHVlcyBpbiBhcnJheSAqL1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2YgZGF0YSkge1xuXG4gICAgICBpZiAoIXRoaXMudmFsaWRhdGUodmFsdWUsIHNjaGVtYS5pdGVtcykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBhIHR1cGxlIChhcnJheSB3aXRoIGZpeGVkIGxlbmd0aCBhbmQgbXVsdGlwbGUgdHlwZXMpXG4gICAqIEBwYXJhbSBkYXRhIERhdGEgdG8gdmFsaWRhdGVcbiAgICogQHBhcmFtIHNjaGVtYXMgU2NoZW1hcyBkZXNjcmliaW5nIHRoZSB0dXBsZVxuICAgKiBAcmV0dXJucyBJZiBkYXRhIGlzIHZhbGlkOiBgdHJ1ZWAsIGlmIGl0IGlzIGludmFsaWQ6IGBmYWxzZWBcbiAgICovXG4gIHByb3RlY3RlZCB2YWxpZGF0ZVR1cGxlKGRhdGE6IHVua25vd25bXSwgc2NoZW1hczogSlNPTlNjaGVtYVtdKTogYm9vbGVhbiB7XG5cbiAgICAvKiBUdXBsZXMgaGF2ZSBhIGZpeGVkIGxlbmd0aCAqL1xuICAgIGlmIChkYXRhLmxlbmd0aCAhPT0gc2NoZW1hcy5sZW5ndGgpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzY2hlbWFzLmxlbmd0aDsgaSArPSAxKSB7XG5cbiAgICAgIGlmICghdGhpcy52YWxpZGF0ZShkYXRhW2ldLCBzY2hlbWFzW2ldKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGFuIG9iamVjdFxuICAgKiBAcGFyYW0gZGF0YSBEYXRhIHRvIHZhbGlkYXRlXG4gICAqIEBwYXJhbSBzY2hlbWEgSlNPTiBzY2hlbWEgZGVzY3JpYmluZyB0aGUgb2JqZWN0XG4gICAqIEByZXR1cm5zIElmIGRhdGEgaXMgdmFsaWQ6IGB0cnVlYCwgaWYgaXQgaXMgaW52YWxpZDogYGZhbHNlYFxuICAgKi9cbiAgcHJvdGVjdGVkIHZhbGlkYXRlT2JqZWN0KGRhdGE6IHVua25vd24sIHNjaGVtYTogSlNPTlNjaGVtYU9iamVjdCk6IGJvb2xlYW4ge1xuXG4gICAgLyogQ2hlY2sgdGhlIHR5cGUgYW5kIGlmIG5vdCBgbnVsbGAgYXMgYG51bGxgIGFsc28gaGF2ZSB0aGUgdHlwZSBgb2JqZWN0YCBpbiBvbGQgYnJvd3NlcnMgKi9cbiAgICBpZiAoKHR5cGVvZiBkYXRhICE9PSAnb2JqZWN0JykgfHwgKGRhdGEgPT09IG51bGwpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyogQ2hlY2sgaWYgdGhlIG9iamVjdCBkb2Vzbid0IGhhdmUgbW9yZSBwcm9wZXJ0aWVzIHRoYW4gZXhwZWN0ZWRcbiAgICAgKiBFcXVpdmFsZW50IG9mIGBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2VgXG4gICAgICovXG4gICAgaWYgKE9iamVjdC5rZXlzKHNjaGVtYS5wcm9wZXJ0aWVzKS5sZW5ndGggPCBPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKiBWYWxpZGF0ZSByZXF1aXJlZCBwcm9wZXJ0aWVzICovXG4gICAgaWYgKHNjaGVtYS5yZXF1aXJlZCkge1xuXG4gICAgICBmb3IgKGNvbnN0IHJlcXVpcmVkUHJvcCBvZiBzY2hlbWEucmVxdWlyZWQpIHtcblxuICAgICAgICBpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkocmVxdWlyZWRQcm9wKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9XG5cbiAgICAvKiBSZWN1cnNpdmVseSB2YWxpZGF0ZSBhbGwgcHJvcGVydGllcyAqL1xuICAgIGZvciAoY29uc3QgcHJvcGVydHkgaW4gc2NoZW1hLnByb3BlcnRpZXMpIHtcblxuICAgICAgLyogRmlsdGVyIHRvIGtlZXAgb25seSByZWFsIHByb3BlcnRpZXMgKG5vIGludGVybmFsIEpTIHN0dWZmKSBhbmQgY2hlY2sgaWYgdGhlIGRhdGEgaGFzIHRoZSBwcm9wZXJ0eSB0b28gKi9cbiAgICAgIGlmIChzY2hlbWEucHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgJiYgZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcblxuICAgICAgICBpZiAoIXRoaXMudmFsaWRhdGUoKGRhdGEgYXMgeyBbazogc3RyaW5nXTogdW5rbm93bjsgfSlbcHJvcGVydHldLCBzY2hlbWEucHJvcGVydGllc1twcm9wZXJ0eV0pKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuXG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgYSBjb25zdGFudFxuICAgKiBAcGFyYW0gZGF0YSBEYXRhIHRhIHZhbGlkYXRlXG4gICAqIEBwYXJhbSBzY2hlbWEgSlNPTiBzY2hlbWEgZGVzY3JpYmluZyB0aGUgY29uc3RhbnRcbiAgICogQHJldHVybnMgSWYgZGF0YSBpcyB2YWxpZDogYHRydWVgLCBpZiBpdCBpcyBpbnZhbGlkOiBgZmFsc2VgXG4gICAqL1xuICBwcm90ZWN0ZWQgdmFsaWRhdGVDb25zdChkYXRhOiB1bmtub3duLCBzY2hlbWE6IEpTT05TY2hlbWFCb29sZWFuIHwgSlNPTlNjaGVtYUludGVnZXIgfCBKU09OU2NoZW1hTnVtYmVyIHwgSlNPTlNjaGVtYVN0cmluZyk6IGJvb2xlYW4ge1xuXG4gICAgaWYgKCFzY2hlbWEuY29uc3QpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiAoZGF0YSA9PT0gc2NoZW1hLmNvbnN0KTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGFuIGVudW1cbiAgICogQHBhcmFtIGRhdGEgRGF0YSB0YSB2YWxpZGF0ZVxuICAgKiBAcGFyYW0gc2NoZW1hIEpTT04gc2NoZW1hIGRlc2NyaWJpbmcgdGhlIGVudW1cbiAgICogQHJldHVybnMgSWYgZGF0YSBpcyB2YWxpZDogYHRydWVgLCBpZiBpdCBpcyBpbnZhbGlkOiBgZmFsc2VgXG4gICAqL1xuICBwcm90ZWN0ZWQgdmFsaWRhdGVFbnVtKGRhdGE6IHVua25vd24sIHNjaGVtYTogSlNPTlNjaGVtYUludGVnZXIgfCBKU09OU2NoZW1hTnVtYmVyIHwgSlNPTlNjaGVtYVN0cmluZyk6IGJvb2xlYW4ge1xuXG4gICAgaWYgKCFzY2hlbWEuZW51bSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyogQ2FzdCBhcyB0aGUgZGF0YSBjYW4gYmUgb2YgbXVsdGlwbGUgdHlwZXMsIGFuZCBzbyBUeXBlU2NyaXB0IGlzIGxvc3QgKi9cbiAgICByZXR1cm4gKChzY2hlbWEuZW51bSBhcyB1bmtub3duW10pLmluY2x1ZGVzKGRhdGEpKTtcblxuICB9XG5cbn1cbiJdfQ==