import { JSONSchema, JSONSchemaString, JSONSchemaInteger, JSONSchemaNumber, JSONSchemaBoolean, JSONSchemaArray, JSONSchemaObject } from './json-schema';
export declare class JSONValidator {
    /**
     * Validate a JSON data against a Jsubset of the JSON Schema standard.
     * Types are enforced to validate everything: each schema must
     * @param data JSON data to validate
     * @param schema Subset of JSON Schema. Must have a `type`.
     * @returns If data is valid: `true`, if it is invalid: `false`
     * @see {@link https://github.com/cyrilletuzi/angular-async-local-storage/blob/master/docs/VALIDATION.md}
     */
    validate(data: unknown, schema: JSONSchema): boolean;
    /**
     * Validate a string
     * @param data Data to validate
     * @param schema Schema describing the string
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    protected validateString(data: unknown, schema: JSONSchemaString): boolean;
    /**
     * Validate a number or an integer
     * @param data Data to validate
     * @param schema Schema describing the number or integer
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    protected validateNumber(data: unknown, schema: JSONSchemaNumber | JSONSchemaInteger): boolean;
    /**
     * Validate a boolean
     * @param data Data to validate
     * @param schema Schema describing the boolean
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    protected validateBoolean(data: unknown, schema: JSONSchemaBoolean): boolean;
    /**
     * Validate an array
     * @param data Data to validate
     * @param schema Schema describing the array
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    protected validateArray(data: unknown, schema: JSONSchemaArray): boolean;
    /**
     * Validate a tuple (array with fixed length and multiple types)
     * @param data Data to validate
     * @param schemas Schemas describing the tuple
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    protected validateTuple(data: unknown[], schemas: JSONSchema[]): boolean;
    /**
     * Validate an object
     * @param data Data to validate
     * @param schema JSON schema describing the object
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    protected validateObject(data: unknown, schema: JSONSchemaObject): boolean;
    /**
     * Validate a constant
     * @param data Data ta validate
     * @param schema JSON schema describing the constant
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    protected validateConst(data: unknown, schema: JSONSchemaBoolean | JSONSchemaInteger | JSONSchemaNumber | JSONSchemaString): boolean;
    /**
     * Validate an enum
     * @param data Data ta validate
     * @param schema JSON schema describing the enum
     * @returns If data is valid: `true`, if it is invalid: `false`
     */
    protected validateEnum(data: unknown, schema: JSONSchemaInteger | JSONSchemaNumber | JSONSchemaString): boolean;
}
