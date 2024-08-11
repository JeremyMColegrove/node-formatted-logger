import { Color, Options } from '../types.js';
export declare function forEachRight(array: any[], callback: (item: any, index: number, array: any[]) => any): void;
export declare function type(value: any): "Array" | "Error" | "Object";
export declare function repeat(value: string, times: number): string;
/**
 * Creates a string with specified spaces count
 * @param {number} spaceCount - space count
 * @return {string}
 */
export declare function indent(spaceCount: number): string;
/**
 * Gets longest string length
 * @param {Array<string>} strings
 * @return {number}
 */
export declare function maxLength(strings: Array<string>): number;
/**
 * Indents a single or multiline string with a given indentation.
 * @param {string} string - single or multiline string
 * @param {string} indentation - indentation space as string
 * @return {string} - Indented multiline string
 */
export declare function alignString(string: string, indentation: string): string;
export declare function stringify(thing: any, options: Options): string;
/**
 * Colors a string (for terminal output)
 * @param {string} string
 * @param {string} color - name of the color to apply
 * @return {string} - colored string (for terminal output)
 */
export declare function colorThing(string: string, color: Color, disabled: boolean): string;
export declare function isObject(item: any): any;
export declare function mergeDeep(target: any, ...sources: any): any;
