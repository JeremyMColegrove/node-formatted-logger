'use strict';

import * as colors from 'colors/safe.js';
import { Color, Options } from '../types.js';

export function forEachRight(array:any[], callback:(item:any, index:number, array:any[])=>any) {
    for (let i = array.length - 1; i >= 0; i--) {
        callback(array[i], i, array);
    }
}

export function type (value:any) {
    if (Array.isArray(value)) {
        return 'Array'
    }
    if (value instanceof Error) {
      return 'Error'
    }
    return 'Object'
}

export function repeat(value:string, times:number):string {
    if (times >= 1 && times < 999) {
        return value.repeat(times);
    }
    return ''
}

/**
 * Creates a string with specified spaces count
 * @param {number} spaceCount - space count
 * @return {string}
 */
export function indent(spaceCount: number): string {
    return repeat(' ', spaceCount)
}

/**
 * Gets longest string length
 * @param {Array<string>} strings
 * @return {number}
 */
export function maxLength(strings: Array<string>): number {
    let maxLength = 0;
    strings.forEach((string) => {
        const length = string.length;
        if (length > maxLength) maxLength = length;
    });

    return maxLength;
}

/**
 * Indents a single or multiline string with a given indentation.
 * @param {string} string - single or multiline string
 * @param {string} indentation - indentation space as string
 * @return {string} - Indented multiline string
 */
export function alignString(string: string, indentation: string): string {
    const pattern = new RegExp('\n', 'g'); //eslint-disable-line no-control-regex
    return `${indentation}${string}`.replace(pattern, `\n${indentation}`);
}

export function stringify(thing:any, options:Options):string {
    var string:string = `${thing}`
    if (thing === null) string = 'null';
    if (thing === undefined) string = 'undefined';
    if (thing instanceof Date) {
        return options.dateTransformer(thing)
    }

    return string
}

/**
 * Colors a string (for terminal output)
 * @param {string} string
 * @param {string} color - name of the color to apply
 * @return {string} - colored string (for terminal output)
 */
export function colorThing(string:string, color: Color, disabled:boolean): string {
    if (disabled) {
        return string
    }
    return colors[color](string);
}


export function isObject(item:any) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }
  
export function mergeDeep(target:any, ...sources:any) {
    if (!sources.length) return target;
    const source = sources.shift();
  
    if (isObject(target) && isObject(source)) {    
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) { 
            Object.assign(target, { [key]: {} });
          }else{          
            target[key] = Object.assign({}, target[key])
          }
          mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  
    return mergeDeep(target, ...sources);
  }