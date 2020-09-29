import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
// TODO: detailed error messages?
let JSONValidator = class JSONValidator {
    /**
     * Validate a JSON data against a Jsubset of the JSON Schema standard.
     * Types are enforced to validate everything: each schema must
     * @param data JSON data to validate
     * @param schema Subset of JSON Schema. Must have a `type`.
     * @returns If data is valid: `true`, if it is invalid: `false`
     * @see {@link https://github.com/cyrilletuzi/angular-async-local-storage/blob/master/docs/VALIDATION.md}
     */
    validate(data, schema) {
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
    }
    /**
     * Validate a string
     * @param data Data to validate
     * @param schema Schema describing the string
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    validateString(data, schema) {
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
            let regularExpression = null;
            try {
                regularExpression = new RegExp(schema.pattern);
            }
            catch (_a) { }
            if (regularExpression && !regularExpression.test(data)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Validate a number or an integer
     * @param data Data to validate
     * @param schema Schema describing the number or integer
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    validateNumber(data, schema) {
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
    }
    /**
     * Validate a boolean
     * @param data Data to validate
     * @param schema Schema describing the boolean
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    validateBoolean(data, schema) {
        if (typeof data !== 'boolean') {
            return false;
        }
        if (!this.validateConst(data, schema)) {
            return false;
        }
        return true;
    }
    /**
     * Validate an array
     * @param data Data to validate
     * @param schema Schema describing the array
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    validateArray(data, schema) {
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
            const dataSet = new Set(data);
            if (data.length !== dataSet.size) {
                return false;
            }
        }
        /* Specific test for tuples */
        if (Array.isArray(schema.items)) {
            return this.validateTuple(data, schema.items);
        }
        /* Validate all the values in array */
        for (const value of data) {
            if (!this.validate(value, schema.items)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Validate a tuple (array with fixed length and multiple types)
     * @param data Data to validate
     * @param schemas Schemas describing the tuple
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    validateTuple(data, schemas) {
        /* Tuples have a fixed length */
        if (data.length !== schemas.length) {
            return false;
        }
        for (let i = 0; i < schemas.length; i += 1) {
            if (!this.validate(data[i], schemas[i])) {
                return false;
            }
        }
        return true;
    }
    /**
     * Validate an object
     * @param data Data to validate
     * @param schema JSON schema describing the object
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    validateObject(data, schema) {
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
            for (const requiredProp of schema.required) {
                if (!data.hasOwnProperty(requiredProp)) {
                    return false;
                }
            }
        }
        /* Recursively validate all properties */
        for (const property in schema.properties) {
            /* Filter to keep only real properties (no internal JS stuff) and check if the data has the property too */
            if (schema.properties.hasOwnProperty(property) && data.hasOwnProperty(property)) {
                if (!this.validate(data[property], schema.properties[property])) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * Validate a constant
     * @param data Data ta validate
     * @param schema JSON schema describing the constant
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    validateConst(data, schema) {
        if (!schema.const) {
            return true;
        }
        return (data === schema.const);
    }
    /**
     * Validate an enum
     * @param data Data ta validate
     * @param schema JSON schema describing the enum
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    validateEnum(data, schema) {
        if (!schema.enum) {
            return true;
        }
        /* Cast as the data can be of multiple types, and so TypeScript is lost */
        return (schema.enum.includes(data));
    }
};
JSONValidator.ɵprov = i0.ɵɵdefineInjectable({ factory: function JSONValidator_Factory() { return new JSONValidator(); }, token: JSONValidator, providedIn: "root" });
JSONValidator = __decorate([
    Injectable({
        providedIn: 'root'
    })
], JSONValidator);
export { JSONValidator };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi12YWxpZGF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LXB3YS9sb2NhbC1zdG9yYWdlLyIsInNvdXJjZXMiOlsibGliL3ZhbGlkYXRpb24vanNvbi12YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBTTNDLGlDQUFpQztBQUlqQyxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO0lBRXhCOzs7Ozs7O09BT0c7SUFDSCxRQUFRLENBQUMsSUFBYSxFQUFFLE1BQWtCO1FBRXhDLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRTtZQUVuQixLQUFLLFFBQVE7Z0JBQ1gsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzQyxLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssU0FBUztnQkFDWixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzNDLEtBQUssU0FBUztnQkFDWixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzVDLEtBQUssT0FBTztnQkFDVixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzFDLEtBQUssUUFBUTtnQkFDWCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBRTVDO0lBRUgsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sY0FBYyxDQUFDLElBQWEsRUFBRSxNQUF3QjtRQUU5RCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM1QixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDcEMsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDeEUsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDeEUsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtZQUVsQixJQUFJLGlCQUFpQixHQUFrQixJQUFJLENBQUM7WUFFNUMsSUFBSTtnQkFDRixpQkFBaUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDaEQ7WUFBQyxXQUFNLEdBQUU7WUFFVixJQUFJLGlCQUFpQixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN0RCxPQUFPLEtBQUssQ0FBQzthQUNkO1NBRUY7UUFFRCxPQUFPLElBQUksQ0FBQztJQUVkLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLGNBQWMsQ0FBQyxJQUFhLEVBQUUsTUFBNEM7UUFFbEYsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDNUIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMxRCxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDcEMsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELDhDQUE4QztRQUM5QyxJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDcEUsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMzRCxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7WUFDaEYsT0FBTyxLQUFLLENBQUM7U0FFZDtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUM3RCxPQUFPLEtBQUssQ0FBQztTQUVkO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtZQUM5RSxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBRWQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sZUFBZSxDQUFDLElBQWEsRUFBRSxNQUF5QjtRQUVoRSxJQUFJLE9BQU8sSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUM3QixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxPQUFPLElBQUksQ0FBQztJQUVkLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLGFBQWEsQ0FBQyxJQUFhLEVBQUUsTUFBdUI7UUFFNUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDdEUsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDdEUsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtZQUV0QiwrREFBK0Q7WUFDL0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFOUIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxJQUFJLEVBQUU7Z0JBQ2hDLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7U0FFRjtRQUVELDhCQUE4QjtRQUM5QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBRS9CLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBRS9DO1FBRUQsc0NBQXNDO1FBQ3RDLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxFQUFFO1lBRXhCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3ZDLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7U0FFRjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBRWQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sYUFBYSxDQUFDLElBQWUsRUFBRSxPQUFxQjtRQUU1RCxnQ0FBZ0M7UUFDaEMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFFbEMsT0FBTyxLQUFLLENBQUM7U0FFZDtRQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFFMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN2QyxPQUFPLEtBQUssQ0FBQzthQUNkO1NBRUY7UUFFRCxPQUFPLElBQUksQ0FBQztJQUVkLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLGNBQWMsQ0FBQyxJQUFhLEVBQUUsTUFBd0I7UUFFOUQsNEZBQTRGO1FBQzVGLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtZQUNqRCxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQ7O1dBRUc7UUFDSCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUNwRSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsa0NBQWtDO1FBQ2xDLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUVuQixLQUFLLE1BQU0sWUFBWSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7Z0JBRTFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxFQUFFO29CQUN0QyxPQUFPLEtBQUssQ0FBQztpQkFDZDthQUVGO1NBRUY7UUFFRCx5Q0FBeUM7UUFDekMsS0FBSyxNQUFNLFFBQVEsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFO1lBRXhDLDJHQUEyRztZQUMzRyxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBRS9FLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFFLElBQWtDLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO29CQUM5RixPQUFPLEtBQUssQ0FBQztpQkFDZDthQUVGO1NBRUY7UUFFRCxPQUFPLElBQUksQ0FBQztJQUVkLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLGFBQWEsQ0FBQyxJQUFhLEVBQUUsTUFBbUY7UUFFeEgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDakIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE9BQU8sQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRWpDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLFlBQVksQ0FBQyxJQUFhLEVBQUUsTUFBK0Q7UUFFbkcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7WUFDaEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELDBFQUEwRTtRQUMxRSxPQUFPLENBQUUsTUFBTSxDQUFDLElBQWtCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFckQsQ0FBQztDQUVGLENBQUE7O0FBclRZLGFBQWE7SUFIekIsVUFBVSxDQUFDO1FBQ1YsVUFBVSxFQUFFLE1BQU07S0FDbkIsQ0FBQztHQUNXLGFBQWEsQ0FxVHpCO1NBclRZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBKU09OU2NoZW1hLCBKU09OU2NoZW1hU3RyaW5nLCBKU09OU2NoZW1hSW50ZWdlciwgSlNPTlNjaGVtYU51bWJlciwgSlNPTlNjaGVtYUJvb2xlYW4sXG4gIEpTT05TY2hlbWFBcnJheSwgSlNPTlNjaGVtYU9iamVjdFxufSBmcm9tICcuL2pzb24tc2NoZW1hJztcblxuLy8gVE9ETzogZGV0YWlsZWQgZXJyb3IgbWVzc2FnZXM/XG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBKU09OVmFsaWRhdG9yIHtcblxuICAvKipcbiAgICogVmFsaWRhdGUgYSBKU09OIGRhdGEgYWdhaW5zdCBhIEpzdWJzZXQgb2YgdGhlIEpTT04gU2NoZW1hIHN0YW5kYXJkLlxuICAgKiBUeXBlcyBhcmUgZW5mb3JjZWQgdG8gdmFsaWRhdGUgZXZlcnl0aGluZzogZWFjaCBzY2hlbWEgbXVzdFxuICAgKiBAcGFyYW0gZGF0YSBKU09OIGRhdGEgdG8gdmFsaWRhdGVcbiAgICogQHBhcmFtIHNjaGVtYSBTdWJzZXQgb2YgSlNPTiBTY2hlbWEuIE11c3QgaGF2ZSBhIGB0eXBlYC5cbiAgICogQHJldHVybnMgSWYgZGF0YSBpcyB2YWxpZDogYHRydWVgLCBpZiBpdCBpcyBpbnZhbGlkOiBgZmFsc2VgXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9jeXJpbGxldHV6aS9hbmd1bGFyLWFzeW5jLWxvY2FsLXN0b3JhZ2UvYmxvYi9tYXN0ZXIvZG9jcy9WQUxJREFUSU9OLm1kfVxuICAgKi9cbiAgdmFsaWRhdGUoZGF0YTogdW5rbm93biwgc2NoZW1hOiBKU09OU2NoZW1hKTogYm9vbGVhbiB7XG5cbiAgICBzd2l0Y2ggKHNjaGVtYS50eXBlKSB7XG5cbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlU3RyaW5nKGRhdGEsIHNjaGVtYSk7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlTnVtYmVyKGRhdGEsIHNjaGVtYSk7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVCb29sZWFuKGRhdGEsIHNjaGVtYSk7XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlQXJyYXkoZGF0YSwgc2NoZW1hKTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlT2JqZWN0KGRhdGEsIHNjaGVtYSk7XG5cbiAgICB9XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBhIHN0cmluZ1xuICAgKiBAcGFyYW0gZGF0YSBEYXRhIHRvIHZhbGlkYXRlXG4gICAqIEBwYXJhbSBzY2hlbWEgU2NoZW1hIGRlc2NyaWJpbmcgdGhlIHN0cmluZ1xuICAgKiBAcmV0dXJucyBJZiBkYXRhIGlzIHZhbGlkOiBgdHJ1ZWAsIGlmIGl0IGlzIGludmFsaWQ6IGBmYWxzZWBcbiAgICovXG4gIHByb3RlY3RlZCB2YWxpZGF0ZVN0cmluZyhkYXRhOiB1bmtub3duLCBzY2hlbWE6IEpTT05TY2hlbWFTdHJpbmcpOiBib29sZWFuIHtcblxuICAgIGlmICh0eXBlb2YgZGF0YSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMudmFsaWRhdGVDb25zdChkYXRhLCBzY2hlbWEpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnZhbGlkYXRlRW51bShkYXRhLCBzY2hlbWEpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKChzY2hlbWEubWF4TGVuZ3RoICE9PSB1bmRlZmluZWQpICYmIChkYXRhLmxlbmd0aCA+IHNjaGVtYS5tYXhMZW5ndGgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKChzY2hlbWEubWluTGVuZ3RoICE9PSB1bmRlZmluZWQpICYmIChkYXRhLmxlbmd0aCA8IHNjaGVtYS5taW5MZW5ndGgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHNjaGVtYS5wYXR0ZXJuKSB7XG5cbiAgICAgIGxldCByZWd1bGFyRXhwcmVzc2lvbjogUmVnRXhwIHwgbnVsbCA9IG51bGw7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlZ3VsYXJFeHByZXNzaW9uID0gbmV3IFJlZ0V4cChzY2hlbWEucGF0dGVybik7XG4gICAgICB9IGNhdGNoIHt9XG5cbiAgICAgIGlmIChyZWd1bGFyRXhwcmVzc2lvbiAmJiAhcmVndWxhckV4cHJlc3Npb24udGVzdChkYXRhKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGEgbnVtYmVyIG9yIGFuIGludGVnZXJcbiAgICogQHBhcmFtIGRhdGEgRGF0YSB0byB2YWxpZGF0ZVxuICAgKiBAcGFyYW0gc2NoZW1hIFNjaGVtYSBkZXNjcmliaW5nIHRoZSBudW1iZXIgb3IgaW50ZWdlclxuICAgKiBAcmV0dXJucyBJZiBkYXRhIGlzIHZhbGlkOiBgdHJ1ZWAsIGlmIGl0IGlzIGludmFsaWQ6IGBmYWxzZWBcbiAgICovXG4gIHByb3RlY3RlZCB2YWxpZGF0ZU51bWJlcihkYXRhOiB1bmtub3duLCBzY2hlbWE6IEpTT05TY2hlbWFOdW1iZXIgfMKgSlNPTlNjaGVtYUludGVnZXIpOiBib29sZWFuIHtcblxuICAgIGlmICh0eXBlb2YgZGF0YSAhPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoKHNjaGVtYS50eXBlID09PSAnaW50ZWdlcicpICYmICFOdW1iZXIuaXNJbnRlZ2VyKGRhdGEpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnZhbGlkYXRlQ29uc3QoZGF0YSwgc2NoZW1hKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghdGhpcy52YWxpZGF0ZUVudW0oZGF0YSwgc2NoZW1hKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qIFRlc3QgaXMgZG9uZSB0aGlzIHdheSB0byBub3QgZGl2aWRlIGJ5IDAgKi9cbiAgICBpZiAoc2NoZW1hLm11bHRpcGxlT2YgJiYgIU51bWJlci5pc0ludGVnZXIoZGF0YSAvIHNjaGVtYS5tdWx0aXBsZU9mKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICgoc2NoZW1hLm1heGltdW0gIT09IHVuZGVmaW5lZCkgJiYgKGRhdGEgPiBzY2hlbWEubWF4aW11bSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICgoc2NoZW1hLmV4Y2x1c2l2ZU1heGltdW0gIT09IHVuZGVmaW5lZCkgJiYgKGRhdGEgPj0gc2NoZW1hLmV4Y2x1c2l2ZU1heGltdW0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICB9XG5cbiAgICBpZiAoKHNjaGVtYS5taW5pbXVtICE9PSB1bmRlZmluZWQpICYmIChkYXRhIDwgc2NoZW1hLm1pbmltdW0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICB9XG5cbiAgICBpZiAoKHNjaGVtYS5leGNsdXNpdmVNaW5pbXVtICE9PSB1bmRlZmluZWQpICYmIChkYXRhIDw9IHNjaGVtYS5leGNsdXNpdmVNaW5pbXVtKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBhIGJvb2xlYW5cbiAgICogQHBhcmFtIGRhdGEgRGF0YSB0byB2YWxpZGF0ZVxuICAgKiBAcGFyYW0gc2NoZW1hIFNjaGVtYSBkZXNjcmliaW5nIHRoZSBib29sZWFuXG4gICAqIEByZXR1cm5zIElmIGRhdGEgaXMgdmFsaWQ6IGB0cnVlYCwgaWYgaXQgaXMgaW52YWxpZDogYGZhbHNlYFxuICAgKi9cbiAgcHJvdGVjdGVkIHZhbGlkYXRlQm9vbGVhbihkYXRhOiB1bmtub3duLCBzY2hlbWE6IEpTT05TY2hlbWFCb29sZWFuKTogYm9vbGVhbiB7XG5cbiAgICBpZiAodHlwZW9mIGRhdGEgIT09ICdib29sZWFuJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghdGhpcy52YWxpZGF0ZUNvbnN0KGRhdGEsIHNjaGVtYSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGFuIGFycmF5XG4gICAqIEBwYXJhbSBkYXRhIERhdGEgdG8gdmFsaWRhdGVcbiAgICogQHBhcmFtIHNjaGVtYSBTY2hlbWEgZGVzY3JpYmluZyB0aGUgYXJyYXlcbiAgICogQHJldHVybnMgSWYgZGF0YSBpcyB2YWxpZDogYHRydWVgLCBpZiBpdCBpcyBpbnZhbGlkOiBgZmFsc2VgXG4gICAqL1xuICBwcm90ZWN0ZWQgdmFsaWRhdGVBcnJheShkYXRhOiB1bmtub3duLCBzY2hlbWE6IEpTT05TY2hlbWFBcnJheSk6IGJvb2xlYW4ge1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKChzY2hlbWEubWF4SXRlbXMgIT09IHVuZGVmaW5lZCkgJiYgKGRhdGEubGVuZ3RoID4gc2NoZW1hLm1heEl0ZW1zKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICgoc2NoZW1hLm1pbkl0ZW1zICE9PSB1bmRlZmluZWQpICYmIChkYXRhLmxlbmd0aCA8IHNjaGVtYS5taW5JdGVtcykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoc2NoZW1hLnVuaXF1ZUl0ZW1zKSB7XG5cbiAgICAgIC8qIENyZWF0ZSBhIHNldCB0byBlbGltaW5hdGUgdmFsdWVzIHdpdGggbXVsdGlwbGUgb2NjdXJlbmNlcyAqL1xuICAgICAgY29uc3QgZGF0YVNldCA9IG5ldyBTZXQoZGF0YSk7XG5cbiAgICAgIGlmIChkYXRhLmxlbmd0aCAhPT0gZGF0YVNldC5zaXplKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIC8qIFNwZWNpZmljIHRlc3QgZm9yIHR1cGxlcyAqL1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNjaGVtYS5pdGVtcykpIHtcblxuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVUdXBsZShkYXRhLCBzY2hlbWEuaXRlbXMpO1xuXG4gICAgfVxuXG4gICAgLyogVmFsaWRhdGUgYWxsIHRoZSB2YWx1ZXMgaW4gYXJyYXkgKi9cbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIGRhdGEpIHtcblxuICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlKHZhbHVlLCBzY2hlbWEuaXRlbXMpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuXG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgYSB0dXBsZSAoYXJyYXkgd2l0aCBmaXhlZCBsZW5ndGggYW5kIG11bHRpcGxlIHR5cGVzKVxuICAgKiBAcGFyYW0gZGF0YSBEYXRhIHRvIHZhbGlkYXRlXG4gICAqIEBwYXJhbSBzY2hlbWFzIFNjaGVtYXMgZGVzY3JpYmluZyB0aGUgdHVwbGVcbiAgICogQHJldHVybnMgSWYgZGF0YSBpcyB2YWxpZDogYHRydWVgLCBpZiBpdCBpcyBpbnZhbGlkOiBgZmFsc2VgXG4gICAqL1xuICBwcm90ZWN0ZWQgdmFsaWRhdGVUdXBsZShkYXRhOiB1bmtub3duW10sIHNjaGVtYXM6IEpTT05TY2hlbWFbXSk6IGJvb2xlYW4ge1xuXG4gICAgLyogVHVwbGVzIGhhdmUgYSBmaXhlZCBsZW5ndGggKi9cbiAgICBpZiAoZGF0YS5sZW5ndGggIT09IHNjaGVtYXMubGVuZ3RoKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NoZW1hcy5sZW5ndGg7IGkgKz0gMSkge1xuXG4gICAgICBpZiAoIXRoaXMudmFsaWRhdGUoZGF0YVtpXSwgc2NoZW1hc1tpXSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBhbiBvYmplY3RcbiAgICogQHBhcmFtIGRhdGEgRGF0YSB0byB2YWxpZGF0ZVxuICAgKiBAcGFyYW0gc2NoZW1hIEpTT04gc2NoZW1hIGRlc2NyaWJpbmcgdGhlIG9iamVjdFxuICAgKiBAcmV0dXJucyBJZiBkYXRhIGlzIHZhbGlkOiBgdHJ1ZWAsIGlmIGl0IGlzIGludmFsaWQ6IGBmYWxzZWBcbiAgICovXG4gIHByb3RlY3RlZCB2YWxpZGF0ZU9iamVjdChkYXRhOiB1bmtub3duLCBzY2hlbWE6IEpTT05TY2hlbWFPYmplY3QpOiBib29sZWFuIHtcblxuICAgIC8qIENoZWNrIHRoZSB0eXBlIGFuZCBpZiBub3QgYG51bGxgIGFzIGBudWxsYCBhbHNvIGhhdmUgdGhlIHR5cGUgYG9iamVjdGAgaW4gb2xkIGJyb3dzZXJzICovXG4gICAgaWYgKCh0eXBlb2YgZGF0YSAhPT0gJ29iamVjdCcpIHx8IChkYXRhID09PSBudWxsKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qIENoZWNrIGlmIHRoZSBvYmplY3QgZG9lc24ndCBoYXZlIG1vcmUgcHJvcGVydGllcyB0aGFuIGV4cGVjdGVkXG4gICAgICogRXF1aXZhbGVudCBvZiBgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlYFxuICAgICAqL1xuICAgIGlmIChPYmplY3Qua2V5cyhzY2hlbWEucHJvcGVydGllcykubGVuZ3RoIDwgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyogVmFsaWRhdGUgcmVxdWlyZWQgcHJvcGVydGllcyAqL1xuICAgIGlmIChzY2hlbWEucmVxdWlyZWQpIHtcblxuICAgICAgZm9yIChjb25zdCByZXF1aXJlZFByb3Agb2Ygc2NoZW1hLnJlcXVpcmVkKSB7XG5cbiAgICAgICAgaWYgKCFkYXRhLmhhc093blByb3BlcnR5KHJlcXVpcmVkUHJvcCkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyogUmVjdXJzaXZlbHkgdmFsaWRhdGUgYWxsIHByb3BlcnRpZXMgKi9cbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIHNjaGVtYS5wcm9wZXJ0aWVzKSB7XG5cbiAgICAgIC8qIEZpbHRlciB0byBrZWVwIG9ubHkgcmVhbCBwcm9wZXJ0aWVzIChubyBpbnRlcm5hbCBKUyBzdHVmZikgYW5kIGNoZWNrIGlmIHRoZSBkYXRhIGhhcyB0aGUgcHJvcGVydHkgdG9vICovXG4gICAgICBpZiAoc2NoZW1hLnByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpICYmIGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlKChkYXRhIGFzIHsgW2s6IHN0cmluZ106IHVua25vd247IH0pW3Byb3BlcnR5XSwgc2NoZW1hLnByb3BlcnRpZXNbcHJvcGVydHldKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGEgY29uc3RhbnRcbiAgICogQHBhcmFtIGRhdGEgRGF0YSB0YSB2YWxpZGF0ZVxuICAgKiBAcGFyYW0gc2NoZW1hIEpTT04gc2NoZW1hIGRlc2NyaWJpbmcgdGhlIGNvbnN0YW50XG4gICAqIEByZXR1cm5zIElmIGRhdGEgaXMgdmFsaWQ6IGB0cnVlYCwgaWYgaXQgaXMgaW52YWxpZDogYGZhbHNlYFxuICAgKi9cbiAgcHJvdGVjdGVkIHZhbGlkYXRlQ29uc3QoZGF0YTogdW5rbm93biwgc2NoZW1hOiBKU09OU2NoZW1hQm9vbGVhbiB8IEpTT05TY2hlbWFJbnRlZ2VyIHwgSlNPTlNjaGVtYU51bWJlciB8IEpTT05TY2hlbWFTdHJpbmcpOiBib29sZWFuIHtcblxuICAgIGlmICghc2NoZW1hLmNvbnN0KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKGRhdGEgPT09IHNjaGVtYS5jb25zdCk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBhbiBlbnVtXG4gICAqIEBwYXJhbSBkYXRhIERhdGEgdGEgdmFsaWRhdGVcbiAgICogQHBhcmFtIHNjaGVtYSBKU09OIHNjaGVtYSBkZXNjcmliaW5nIHRoZSBlbnVtXG4gICAqIEByZXR1cm5zIElmIGRhdGEgaXMgdmFsaWQ6IGB0cnVlYCwgaWYgaXQgaXMgaW52YWxpZDogYGZhbHNlYFxuICAgKi9cbiAgcHJvdGVjdGVkIHZhbGlkYXRlRW51bShkYXRhOiB1bmtub3duLCBzY2hlbWE6IEpTT05TY2hlbWFJbnRlZ2VyIHwgSlNPTlNjaGVtYU51bWJlciB8IEpTT05TY2hlbWFTdHJpbmcpOiBib29sZWFuIHtcblxuICAgIGlmICghc2NoZW1hLmVudW0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8qIENhc3QgYXMgdGhlIGRhdGEgY2FuIGJlIG9mIG11bHRpcGxlIHR5cGVzLCBhbmQgc28gVHlwZVNjcmlwdCBpcyBsb3N0ICovXG4gICAgcmV0dXJuICgoc2NoZW1hLmVudW0gYXMgdW5rbm93bltdKS5pbmNsdWRlcyhkYXRhKSk7XG5cbiAgfVxuXG59XG4iXX0=