import { Options } from "../types.js";
/**
 * Serializable values are boolean, number, null, Date, Single line strings, empty arrays
 * @param {*} input
 * @return {boolean}
 */
export declare function isSerializable(input: any, options: Options): boolean;
export declare function isInlineArray(item: any[], options: Options): boolean;
/**
 * Checks if the data is a single line string
 * @param {*} data
 * @return {boolean} - true if it's a string and it's single line
 */
export declare function isSingleLineString(data: any): boolean;
/**
 * Checks if the input is an empty array
 * @param {*} input
 * @return {boolean}
 */
export declare function isEmptyArray(input: any): boolean;
