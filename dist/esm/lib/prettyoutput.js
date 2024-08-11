'use strict';
import * as utils from './utils.js';
import * as renderer from './renderer.js';
import * as typeInspect from './typeInspect.js';
/**
 * Format a JS/JSON object to YAML-style output.
 * @param {*} input
 * @param {Options} [opts]
 * @param {number} [indent] - Initial level of indent
 * @return {string}
 */
export function render(input, opts, indent) {
    // const options = parseOptions(opts)
    var options = opts;
    const indentation = indent ? utils.indent(indent) : '';
    const stack = [
        { indentation: indentation, depth: 0, input: input, noRender: false },
    ];
    let output = '';
    while (stack.length > 0) {
        const stackElement = stack.pop();
        if (!stackElement)
            continue;
        const depth = stackElement.depth || 0;
        const indentation = stackElement.indentation || '';
        const input = stackElement.input;
        const noRender = stackElement.noRender;
        if (noRender) {
            output = `${output}${input}`;
        }
        else if (depth > options.yamlOptions.maxDepth) {
            output = `${output}${renderer.renderMaxDepth(options, indentation)}`;
        }
        else if (typeInspect.isSerializable(input, options)) {
            output = `${output}${renderer.renderSerializable(input, options, indentation)}`;
        }
        else if (typeof input === 'string') {
            output = `${output}${renderer.renderMultilineString(input, options, indentation)}`;
        }
        else if (Array.isArray(input)) {
            utils.forEachRight(input, (value) => {
                if (typeInspect.isSerializable(value, options)) {
                    const result = renderer.renderSerializableArrayValue(value, options, indentation);
                    stack.push({ input: result, noRender: true, indentation: '', depth: 0 });
                    return true;
                }
                if (depth + 1 > options.yamlOptions.maxDepth) {
                    const result = renderer.renderMaxDepthArrayValue(options, indentation);
                    stack.push({ input: result, noRender: true, indentation: '', depth: 0 });
                    return true;
                }
                stack.push({ input: value, indentation: renderer.indent(indentation, options), depth: depth + 1, noRender: false });
                const dash = renderer.renderDash(options, indentation);
                stack.push({ input: `${dash}\n`, noRender: true, indentation: '', depth: 0 });
            });
        }
        else {
            const isError = input instanceof Error;
            const keys = Object.getOwnPropertyNames(input);
            const valueColumn = options.yamlOptions.alignKeyValues ? utils.maxLength(keys) : 0;
            utils.forEachRight(keys, (key) => {
                const value = input[key];
                if (isError && key === 'stack') {
                    const result = renderer.renderObjectErrorStack(key, value, options, indentation);
                    stack.push({ input: result, noRender: true, indentation: '', depth: 0 });
                    return true;
                }
                if (typeInspect.isSerializable(value, options) || typeInspect.isInlineArray(value, options)) {
                    const result = renderer.renderSerializableObjectValue(key, value, valueColumn, options, indentation);
                    stack.push({ input: result, noRender: true, indentation: '', depth: 0 });
                    return true;
                }
                if (depth + 1 > options.yamlOptions.maxDepth) {
                    const result = renderer.renderMaxDepthObjectValue(key, valueColumn, options, indentation);
                    stack.push({ input: result, noRender: true, indentation: '', depth: 0 });
                    return true;
                }
                stack.push({ input: value, depth: depth + 1, indentation: renderer.indent(indentation, options), noRender: false });
                const renderedKey = renderer.renderObjectKey(key, options, indentation);
                stack.push({ input: `${renderedKey}\n`, noRender: true, indentation: '', depth: 0 });
            });
        }
    }
    return output;
}
