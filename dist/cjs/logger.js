"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = void 0;
const colors_1 = __importDefault(require("colors"));
//@ts-ignore
const prettyoutput_js_1 = require("./lib/prettyoutput.js");
const utils = __importStar(require("./lib/utils.js"));
exports.defaultOptions = {
    groupIndentation: 3,
    dateTransformer: (date) => date.toISOString(),
    logLevels: ['error', 'debug', 'log', 'warn', 'info'],
    yamlOptions: {
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
        alignKeyValues: true,
        indentationCharacter: ' ',
        noColor: false
    },
    pipe: console.log,
    noColor: false,
    autoGroup: true
};
class FormattedLogger {
    constructor(options) {
        this.groupLevel = 0; // Track the level of grouping
        this.groupCount = 0; // Track the number of groups created
        // default options
        this.options = exports.defaultOptions;
        this.options = utils.mergeDeep(this.options, options);
    }
    colorString(thing, color) {
        if (this.options.noColor) {
            return thing;
        }
        return color(thing);
    }
    header(level, color) {
        const timestamp = this.options.dateTransformer(new Date());
        return `${this.colorString(`[${level.toUpperCase()}]`, color)}\t${this.colorString(`[${timestamp}]`, colors_1.default.gray)}\t`;
    }
    indent() {
        return ' '.repeat(this.groupLevel * this.options.groupIndentation); // Add indentation based on the group level
    }
    formatMessage(message) {
        var _a;
        if (typeof message === 'string') {
            return message;
        }
        // return string if yaml disabled
        if (!this.options.yamlOptions.enabled) {
            return message;
        }
        // render the yaml object
        var prettied = (0, prettyoutput_js_1.render)(message, this.options);
        if (prettied.trim().indexOf('\n') == -1) {
            return prettied.trim();
        }
        return this.colorString(`${utils.type(message)} Properties:`, colors_1.default[((_a = this.options.yamlOptions.colors) === null || _a === void 0 ? void 0 : _a.keys) || 'white']) + '\n' + prettied
            .split('\n')
            .map((line, index) => ' '.repeat((this.groupLevel + 1) * this.options.groupIndentation) + line)
            .join('\n');
    }
    getGroupLabel() {
        return `Log Group ${this.groupCount}`;
    }
    __log(level, color, ...messages) {
        var _a;
        if (!((_a = this.options.logLevels) === null || _a === void 0 ? void 0 : _a.includes(level)))
            return;
        if (messages.length > 1) {
            this.options.autoGroup && this.group();
            messages.forEach((message) => {
                var header = this.indent() + this.header(level, color);
                var rendered = this.formatMessage(message);
                this.options.pipe(`${header} ${rendered}`);
            });
            this.options.autoGroup && this.ungroup(); // Automatically end the group
        }
        else {
            var header = this.indent() + this.header(level, color);
            var rendered = this.formatMessage(messages[0]);
            this.options.pipe(`${header} ${rendered}`);
        }
    }
    /**
     * Starts a grouping of logs
     * @param label Label header text
     * @returns FormattedLogger
     */
    group(label) {
        this.options.pipe(this.indent() + this.colorString(`${this.getGroupLabel()}${label ? `: ${label}` : ''}`, colors_1.default.dim));
        this.groupLevel++; // Increase the group level
        return this;
    }
    /**
     * Ends a grouping of logs
     * @returns FormattedLogger
     */
    ungroup() {
        if (this.groupLevel > 0) {
            this.groupLevel--; // Decrease the group level
            this.options.pipe(this.indent() + this.colorString(`${this.getGroupLabel()} END`, colors_1.default.dim));
            this.groupCount++;
        }
        return this;
    }
    /**
     * Log a debug message.
     * @param messages ...any[]
     * @returns FormattedLogger
     */
    debug(...messages) {
        this.__log('debug', colors_1.default.blue, ...messages);
        return this;
    }
    /**
     * Log an info message.
     * @param messages ...any[]
     * @returns FormattedLogger
     */
    info(...messages) {
        this.__log('info', colors_1.default.green, ...messages);
        return this;
    }
    /**
     * Log a warning message.
     * @param messages ...any[]
     * @returns FormattedLogger
     */
    warn(...messages) {
        this.__log('warn', colors_1.default.yellow, ...messages);
        return this;
    }
    /**
     * Log an error message.
     * @param messages ...any[]
     * @returns FormattedLogger
     */
    error(...messages) {
        this.__log('error', colors_1.default.red, ...messages);
        return this;
    }
    /**
     * Log a message.
     * @param messages ...any[]
     * @returns FormattedLogger
     */
    log(...messages) {
        this.__log('log', colors_1.default.gray, ...messages);
        return this;
    }
}
exports.default = FormattedLogger;
