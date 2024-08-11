'use strict';
import * as utils from './utils.js';
import { stringify } from './utils.js';
/**
 * Get color of an input
 * @param {*} input
 * @param {Colors} colors
 * @return {string|null} - color or null if no color
 */
export function inputColor(input, colors) {
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
export function indent(input, options) {
    return `${options.yamlOptions.indentationCharacter}${input}`;
}
export function renderSerializable(input, options, indentation, newline = true) {
    if (Array.isArray(input)) {
        if (input.length > 0 && options.yamlOptions.inlineArrays) {
            return renderInlineArray(input, options, indentation);
        }
        return renderEmptyArray(options, indentation);
    }
    const color = inputColor(input, options.colors);
    const inputResult = utils.colorThing(stringify(input, options), color, options.noColor);
    return `${indentation}${inputResult}${newline ? '\n' : ''}`;
}
export function renderMultilineString(input, options, indentation) {
    const color = inputColor(input, options.colors);
    const indentedString = utils.alignString(input, indent(indentation, options));
    const output = `${indentation}"""\n${indentedString}\n${indentation}"""\n`;
    return utils.colorThing(stringify(output, options), color, options.noColor);
}
export function renderEmptyArray(options, indentation) {
    return `${indentation}(empty array)\n`;
}
export function renderObjectKey(key, options, indentation) {
    const colors = options.colors || {};
    const output = `${indentation}${key}: `;
    return utils.colorThing(stringify(output, options), colors.keys, options.noColor);
}
export function renderDash(options, indentation) {
    const colors = options.colors;
    const output = `${indentation}- `;
    return utils.colorThing(stringify(output, options), colors.dash, options.noColor);
}
export function renderMaxDepth(options, indentation) {
    return `${indentation}(max depth reached)\n`;
}
export function renderSerializableObjectValue(key, value, valueColumn, options, indentation) {
    const renderedKey = renderObjectKey(key, options, indentation);
    const alignSpaces = utils.repeat(' ', valueColumn - key.length);
    const renderedValue = renderSerializable(value, options, alignSpaces);
    return `${renderedKey}${renderedValue}`;
}
export function renderMaxDepthObjectValue(key, valueColumn, options, indentation) {
    const renderedKey = renderObjectKey(key, options, indentation);
    const alignSpaces = utils.repeat(' ', valueColumn - key.length);
    const renderedValue = renderMaxDepth(options, alignSpaces);
    return `${renderedKey}${renderedValue}`;
}
export function renderInlineArray(value, options, indentation) {
    var renderedValue = '[' + value.map(ele => renderSerializable(ele, options, '', false)).join(', ') + ']';
    // const renderedValue = renderSerializable(value, options, '');
    return `${indentation}${renderedValue}\n`;
}
export function renderSerializableArrayValue(value, options, indentation) {
    const renderedDash = renderDash(options, indentation);
    const renderedValue = renderSerializable(value, options, '');
    return `${renderedDash}${renderedValue}`;
}
export function renderMaxDepthArrayValue(options, indentation) {
    const renderedDash = renderDash(options, indentation);
    const renderedValue = renderMaxDepth(options, '');
    return `${renderedDash}${renderedValue}`;
}
export function renderErrorStack(stack, options, indentation) {
    const color = inputColor(stack, options.colors);
    const indentedDash = renderDash(options, indentation);
    const indentedStack = utils.alignString(stack, indentedDash);
    return utils.colorThing(stringify(indentedStack, options), color, options.noColor);
}
export function renderObjectErrorStack(key, stack, options, indentation) {
    const renderedKey = renderObjectKey(key, options, indentation);
    const stackIndentation = indent(indentation, options);
    const renderedStack = renderErrorStack(stack, options, stackIndentation);
    return `${renderedKey}\n${renderedStack}\n`;
}
