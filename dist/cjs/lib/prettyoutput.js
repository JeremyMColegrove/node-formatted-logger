'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = render;
const utils = __importStar(require("./utils.js"));
const renderer = __importStar(require("./renderer.js"));
const typeInspect = __importStar(require("./typeInspect.js"));
var defaultOptions = {
    maxDepth: 6,
    colors: {
        dash: 'white',
        date: 'magenta',
        null: 'dim',
        number: 'yellow',
        string: 'green',
        undefined: 'dim',
        true: 'yellow',
        false: 'yellow',
        keys: 'white'
    },
    enabled: true,
    inlineArrays: false,
    dateTransform: date => date.toString(),
    alignKeyValues: true,
    indentationCharacter: ' ',
    noColor: false
};
function parseOptions(opts) {
    var colors = defaultOptions.colors;
    const options = Object.assign(defaultOptions, opts);
    options.colors = Object.assign(colors, opts.colors);
    return options;
}
/**
 * Format a JS/JSON object to YAML-style output.
 * @param {*} input
 * @param {Options} [opts]
 * @param {number} [indent] - Initial level of indent
 * @return {string}
 */
function render(input, opts, indent) {
    const options = parseOptions(opts);
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
        else if (depth > options.maxDepth) {
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
                if (depth + 1 > options.maxDepth) {
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
            const valueColumn = options.alignKeyValues ? utils.maxLength(keys) : 0;
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
                if (depth + 1 > options.maxDepth) {
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
