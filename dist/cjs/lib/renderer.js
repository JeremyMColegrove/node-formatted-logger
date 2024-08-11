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
exports.inputColor = inputColor;
exports.indent = indent;
exports.renderSerializable = renderSerializable;
exports.renderMultilineString = renderMultilineString;
exports.renderEmptyArray = renderEmptyArray;
exports.renderObjectKey = renderObjectKey;
exports.renderDash = renderDash;
exports.renderMaxDepth = renderMaxDepth;
exports.renderSerializableObjectValue = renderSerializableObjectValue;
exports.renderMaxDepthObjectValue = renderMaxDepthObjectValue;
exports.renderInlineArray = renderInlineArray;
exports.renderSerializableArrayValue = renderSerializableArrayValue;
exports.renderMaxDepthArrayValue = renderMaxDepthArrayValue;
exports.renderErrorStack = renderErrorStack;
exports.renderObjectErrorStack = renderObjectErrorStack;
const utils = __importStar(require("./utils.js"));
const utils_js_1 = require("./utils.js");
/**
 * Get color of an input
 * @param {*} input
 * @param {Colors} colors
 * @return {string|null} - color or null if no color
 */
function inputColor(input, colors) {
    const type = typeof input;
    if (type === 'string')
        return colors.string;
    if (input === true)
        return colors.true;
    if (input === false)
        return colors.false;
    if (input === null)
        return colors.null;
    if (input === undefined)
        return colors.undefined;
    if (type === 'number')
        return colors.number;
    if (input instanceof Date)
        return colors.date;
    return 'white';
}
function indent(input, options) {
    return `${options.indentationCharacter}${input}`;
}
function renderSerializable(input, options, indentation, newline = true) {
    if (Array.isArray(input)) {
        if (input.length > 0 && options.inlineArrays) {
            return renderInlineArray(input, options, indentation);
        }
        return renderEmptyArray(options, indentation);
    }
    const color = inputColor(input, options.colors);
    const inputResult = utils.colorThing((0, utils_js_1.stringify)(input, options), color, options.noColor);
    return `${indentation}${inputResult}${newline ? '\n' : ''}`;
}
function renderMultilineString(input, options, indentation) {
    const color = inputColor(input, options.colors);
    const indentedString = utils.alignString(input, indent(indentation, options));
    const output = `${indentation}"""\n${indentedString}\n${indentation}"""\n`;
    return utils.colorThing((0, utils_js_1.stringify)(output, options), color, options.noColor);
}
function renderEmptyArray(options, indentation) {
    return `${indentation}(empty array)\n`;
}
function renderObjectKey(key, options, indentation) {
    const colors = options.colors || {};
    const output = `${indentation}${key}: `;
    return utils.colorThing((0, utils_js_1.stringify)(output, options), colors.keys, options.noColor);
}
function renderDash(options, indentation) {
    const colors = options.colors;
    const output = `${indentation}- `;
    return utils.colorThing((0, utils_js_1.stringify)(output, options), colors.dash, options.noColor);
}
function renderMaxDepth(options, indentation) {
    return `${indentation}(max depth reached)\n`;
}
function renderSerializableObjectValue(key, value, valueColumn, options, indentation) {
    const renderedKey = renderObjectKey(key, options, indentation);
    const alignSpaces = utils.repeat(' ', valueColumn - key.length);
    const renderedValue = renderSerializable(value, options, alignSpaces);
    return `${renderedKey}${renderedValue}`;
}
function renderMaxDepthObjectValue(key, valueColumn, options, indentation) {
    const renderedKey = renderObjectKey(key, options, indentation);
    const alignSpaces = utils.repeat(' ', valueColumn - key.length);
    const renderedValue = renderMaxDepth(options, alignSpaces);
    return `${renderedKey}${renderedValue}`;
}
function renderInlineArray(value, options, indentation) {
    var renderedValue = '[' + value.map(ele => renderSerializable(ele, options, '', false)).join(', ') + ']';
    // const renderedValue = renderSerializable(value, options, '');
    return `${indentation}${renderedValue}\n`;
}
function renderSerializableArrayValue(value, options, indentation) {
    const renderedDash = renderDash(options, indentation);
    const renderedValue = renderSerializable(value, options, '');
    return `${renderedDash}${renderedValue}`;
}
function renderMaxDepthArrayValue(options, indentation) {
    const renderedDash = renderDash(options, indentation);
    const renderedValue = renderMaxDepth(options, '');
    return `${renderedDash}${renderedValue}`;
}
function renderErrorStack(stack, options, indentation) {
    const color = inputColor(stack, options.colors);
    const indentedDash = renderDash(options, indentation);
    const indentedStack = utils.alignString(stack, indentedDash);
    return utils.colorThing((0, utils_js_1.stringify)(indentedStack, options), color, options.noColor);
}
function renderObjectErrorStack(key, stack, options, indentation) {
    const renderedKey = renderObjectKey(key, options, indentation);
    const stackIndentation = indent(indentation, options);
    const renderedStack = renderErrorStack(stack, options, stackIndentation);
    return `${renderedKey}\n${renderedStack}\n`;
}
