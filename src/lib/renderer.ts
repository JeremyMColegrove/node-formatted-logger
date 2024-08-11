'use strict';

import { Color, Colors, Options } from '../types.js';
import * as utils from './utils.js';
import { stringify } from './utils.js';


/**
 * Get color of an input
 * @param {*} input
 * @param {Colors} colors
 * @return {string|null} - color or null if no color
 */
export function inputColor(input: any, colors: Colors): Color {
    const type = typeof input;

    if (type === 'string') return colors.string;
    if (input === true) return colors.true;
    if (input === false) return colors.false;
    if (input === null) return colors.null;
    if (input === undefined) return colors.undefined;
    if (type === 'number') return colors.number;
    if (input instanceof Date) return colors.date;

    return 'white'
}

export function indent(input: string, options: Options): string {
    return `${options.yamlOptions.indentationCharacter}${input}`;
}

export function renderSerializable(input: any, options: Options, indentation: string, newline:boolean=true): string {
    if (Array.isArray(input)) {
        if (input.length > 0 && options.yamlOptions.inlineArrays) {
            return renderInlineArray(input, options, indentation)
        }
        return renderEmptyArray(options, indentation);
    }

    const color = inputColor(input, options.colors);
    const inputResult = utils.colorThing(stringify(input, options), color, options.noColor);

    return `${indentation}${inputResult}${newline?'\n':''}`;
}

export function renderMultilineString(input: string, options: Options, indentation: string): string {
    const color = inputColor(input, options.colors);
    const indentedString = utils.alignString(input, indent(indentation, options));
    const output = `${indentation}"""\n${indentedString}\n${indentation}"""\n`;

    return utils.colorThing(stringify(output, options), color, options.noColor);
}

export function renderEmptyArray(options: Options, indentation: string): string {
    return `${indentation}(empty array)\n`;
}

export function renderObjectKey(key: string, options: Options, indentation: string): string {
    const colors = options.colors || {};
    const output = `${indentation}${key}: `;

    return utils.colorThing(stringify(output, options), colors.keys, options.noColor);
}

export function renderDash(options: Options, indentation: string): string {
    const colors = options.colors;
    const output = `${indentation}- `;

    return utils.colorThing(stringify(output, options), colors.dash, options.noColor);
}

export function renderMaxDepth(options: Options, indentation: string): string {
    return `${indentation}(max depth reached)\n`;
}

export function renderSerializableObjectValue(key: string, value: any, valueColumn: number, options: Options, indentation: string): string {
    const renderedKey = renderObjectKey(key, options, indentation);
    const alignSpaces = utils.repeat(' ', valueColumn - key.length);
    const renderedValue = renderSerializable(value, options, alignSpaces);

    return `${renderedKey}${renderedValue}`;
}

export function renderMaxDepthObjectValue(key: string, valueColumn: number, options: Options, indentation: string): string {
    const renderedKey = renderObjectKey(key, options, indentation);
    const alignSpaces = utils.repeat(' ', valueColumn - key.length);
    const renderedValue = renderMaxDepth(options, alignSpaces);

    return `${renderedKey}${renderedValue}`;
}

export function renderInlineArray(value: any[], options: Options, indentation: string): string {
    var renderedValue = '[' + value.map(ele=>renderSerializable(ele, options, '', false)).join(', ') + ']'
    // const renderedValue = renderSerializable(value, options, '');

    return `${indentation}${renderedValue}\n`;
}

export function renderSerializableArrayValue(value: any, options: Options, indentation: string): string {
    const renderedDash = renderDash(options, indentation);
    const renderedValue = renderSerializable(value, options, '');

    return `${renderedDash}${renderedValue}`;
}

export function renderMaxDepthArrayValue(options: Options, indentation: string): string {
    const renderedDash = renderDash(options, indentation);
    const renderedValue = renderMaxDepth(options, '');

    return `${renderedDash}${renderedValue}`;
}

export function renderErrorStack(stack: string, options: Options, indentation: string): string {
    const color = inputColor(stack, options.colors!);
    const indentedDash = renderDash(options, indentation);
    const indentedStack = utils.alignString(stack, indentedDash);

    return utils.colorThing(stringify(indentedStack, options), color, options.noColor);
}

export function renderObjectErrorStack(key: string, stack: string, options: Options, indentation: string): string {
    const renderedKey = renderObjectKey(key, options, indentation);
    const stackIndentation = indent(indentation, options);
    const renderedStack = renderErrorStack(stack, options, stackIndentation);
    return `${renderedKey}\n${renderedStack}\n`;
}
