import { Color, Colors, Options } from '../types.js';
/**
 * Get color of an input
 * @param {*} input
 * @param {Colors} colors
 * @return {string|null} - color or null if no color
 */
export declare function inputColor(input: any, colors: Colors): Color;
export declare function indent(input: string, options: Options): string;
export declare function renderSerializable(input: any, options: Options, indentation: string, newline?: boolean): string;
export declare function renderMultilineString(input: string, options: Options, indentation: string): string;
export declare function renderEmptyArray(options: Options, indentation: string): string;
export declare function renderObjectKey(key: string, options: Options, indentation: string): string;
export declare function renderDash(options: Options, indentation: string): string;
export declare function renderMaxDepth(options: Options, indentation: string): string;
export declare function renderSerializableObjectValue(key: string, value: any, valueColumn: number, options: Options, indentation: string): string;
export declare function renderMaxDepthObjectValue(key: string, valueColumn: number, options: Options, indentation: string): string;
export declare function renderInlineArray(value: any[], options: Options, indentation: string): string;
export declare function renderSerializableArrayValue(value: any, options: Options, indentation: string): string;
export declare function renderMaxDepthArrayValue(options: Options, indentation: string): string;
export declare function renderErrorStack(stack: string, options: Options, indentation: string): string;
export declare function renderObjectErrorStack(key: string, stack: string, options: Options, indentation: string): string;
