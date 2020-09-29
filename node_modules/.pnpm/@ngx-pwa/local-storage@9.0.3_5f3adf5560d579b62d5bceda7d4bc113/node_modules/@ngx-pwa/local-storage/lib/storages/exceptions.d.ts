/**
 * Exception message when a value is not valid against the JSON schema
 */
export declare const VALIDATION_ERROR = "Data stored is not valid against the provided JSON schema.\nCheck your JSON schema, otherwise it means data has been corrupted.";
/**
 * Exception raised when a value is not valid against the JSON schema
 */
export declare class ValidationError extends Error {
    message: string;
}
