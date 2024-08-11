import { DeepPartial, Options } from './types.js';
/**
 * Format a JS/JSON object to YAML-style output.
 * @param {*} input
 * @param {Options} [opts]
 * @param {number} [indent] - Initial level of indent
 * @return {string}
 */
export declare function render(input: any, opts: DeepPartial<Options>, indent?: number): string;
