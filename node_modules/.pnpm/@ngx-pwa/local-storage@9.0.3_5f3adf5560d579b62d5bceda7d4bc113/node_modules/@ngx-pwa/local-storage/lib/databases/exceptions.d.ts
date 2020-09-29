/**
 * Exception message when `indexedDB` is not working
 */
export declare const IDB_BROKEN_ERROR = "indexedDB is not working";
/**
 * Exception raised when `indexedDB` is not working
 */
export declare class IDBBrokenError extends Error {
    message: string;
}
/**
 * Exception message when a value can't be serialized for `localStorage`
 */
export declare const SERIALIZATION_ERROR = "The storage is currently localStorage,\nwhere data must be serialized, and the provided data can't be serialized.";
/**
 * Exception raised when a value can't be serialized for `localStorage`
 */
export declare class SerializationError extends Error {
    message: string;
}
