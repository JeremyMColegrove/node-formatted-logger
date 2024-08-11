'use strict';
/**
 * Serializable values are boolean, number, null, Date, Single line strings, empty arrays
 * @param {*} input
 * @return {boolean}
 */
export function isSerializable(input, options) {
    const type = typeof input;
    return (type === 'boolean' ||
        type === 'number' ||
        input === null ||
        input instanceof Date ||
        input === undefined ||
        isSingleLineString(input) ||
        isEmptyArray(input));
}
export function isInlineArray(item, options) {
    return Array.isArray(item) && options.yamlOptions.inlineArrays;
}
/**
 * Checks if the data is a single line string
 * @param {*} data
 * @return {boolean} - true if it's a string and it's single line
 */
export function isSingleLineString(data) {
    return typeof data === 'string' && data.indexOf('\n') === -1;
}
/**
 * Checks if the input is an empty array
 * @param {*} input
 * @return {boolean}
 */
export function isEmptyArray(input) {
    return Array.isArray(input) && input.length <= 0;
}
