'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forEachRight = forEachRight;
exports.type = type;
exports.repeat = repeat;
exports.indent = indent;
exports.maxLength = maxLength;
exports.alignString = alignString;
exports.stringify = stringify;
exports.colorThing = colorThing;
exports.isObject = isObject;
exports.mergeDeep = mergeDeep;
const safe_js_1 = __importDefault(require("colors/safe.js"));
function forEachRight(array, callback) {
    for (let i = array.length - 1; i >= 0; i--) {
        callback(array[i], i, array);
    }
}
function type(value) {
    if (Array.isArray(value)) {
        return 'Array';
    }
    return 'Object';
}
function repeat(value, times) {
    if (times >= 1 && times < 999) {
        return value.repeat(times);
    }
    return '';
}
/**
 * Creates a string with specified spaces count
 * @param {number} spaceCount - space count
 * @return {string}
 */
function indent(spaceCount) {
    return repeat(' ', spaceCount);
}
/**
 * Gets longest string length
 * @param {Array<string>} strings
 * @return {number}
 */
function maxLength(strings) {
    let maxLength = 0;
    strings.forEach((string) => {
        const length = string.length;
        if (length > maxLength)
            maxLength = length;
    });
    return maxLength;
}
/**
 * Indents a single or multiline string with a given indentation.
 * @param {string} string - single or multiline string
 * @param {string} indentation - indentation space as string
 * @return {string} - Indented multiline string
 */
function alignString(string, indentation) {
    const pattern = new RegExp('\n', 'g'); //eslint-disable-line no-control-regex
    return `${indentation}${string}`.replace(pattern, `\n${indentation}`);
}
function stringify(thing, options) {
    var string = `${thing}`;
    if (thing === null)
        string = 'null';
    if (thing === undefined)
        string = 'undefined';
    if (thing instanceof Date) {
        return options.dateTransform(thing);
    }
    return string;
}
/**
 * Colors a string (for terminal output)
 * @param {string} string
 * @param {string} color - name of the color to apply
 * @return {string} - colored string (for terminal output)
 */
function colorThing(string, color, disabled) {
    if (disabled) {
        return string;
    }
    return safe_js_1.default[color](string);
}
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
function mergeDeep(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                else {
                    target[key] = Object.assign({}, target[key]);
                }
                mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return mergeDeep(target, ...sources);
}
