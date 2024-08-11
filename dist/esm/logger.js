import colors from 'colors';
//@ts-ignore
import { render } from './lib/prettyoutput.js';
import * as utils from './lib/utils.js';
export const defaultOptions = {
    groupIndentation: 3,
    dateTransformer: (date) => date.toISOString(),
    logLevels: ['error', 'debug', 'log', 'warn', 'info'],
    colors: {
        info: 'blue',
        log: 'reset',
        warn: 'yellow',
        debug: 'cyan',
        error: 'red',
        dash: 'green',
        date: 'magenta',
        null: 'dim',
        number: 'yellow',
        string: 'reset',
        undefined: 'dim',
        true: 'yellow',
        false: 'yellow',
        keys: 'green'
    },
    yamlOptions: {
        maxDepth: 6,
        enabled: true,
        inlineArrays: false,
        alignKeyValues: true,
        indentationCharacter: ' '
    },
    pipe: console.log,
    noColor: false,
    autoGroup: true
};
export default class FormattedLogger {
    constructor(options) {
        this.groupLevel = 0; // Track the level of grouping
        this.groupCount = 0; // Track the number of groups created
        // default options
        this.options = defaultOptions;
        this.options = utils.mergeDeep(this.options, options);
    }
    static stripColors(...args) {
        // reset all colors and pass back
        return args.map(arg => colors.stripColors(arg));
    }
    colorString(thing, color) {
        if (this.options.noColor) {
            return thing;
        }
        return color(thing);
    }
    header(level, color) {
        const timestamp = this.options.dateTransformer(new Date());
        if (this.options.noColor) {
            return `[${level.toUpperCase()}]\t[${timestamp}]\t`;
        }
        return `${this.colorString(`[${level.toUpperCase()}]`, color)}\t${this.colorString(`[${timestamp}]`, colors.gray)}\t`;
    }
    indent() {
        return ' '.repeat(this.groupLevel * this.options.groupIndentation); // Add indentation based on the group level
    }
    formatMessage(message) {
        // return string if yaml disabled
        if (!this.options.yamlOptions.enabled) {
            return message;
        }
        // render the yaml object
        var prettied = render(message, this.options);
        if (prettied.trim().indexOf('\n') == -1) {
            return prettied.trim();
        }
        return this.colorString(`${utils.type(message)} Properties:`, colors[this.options.colors.string]) + '\n' + prettied
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
        this.options.pipe(this.indent() + this.colorString(`${this.getGroupLabel()}${label ? `: ${label}` : ''}`, colors.dim));
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
            this.options.pipe(this.indent() + this.colorString(`${this.getGroupLabel()} END`, colors.dim));
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
        this.__log('debug', colors[this.options.colors.debug], ...messages);
        return this;
    }
    /**
     * Log an info message.
     * @param messages ...any[]
     * @returns FormattedLogger
     */
    info(...messages) {
        this.__log('info', colors[this.options.colors.info], ...messages);
        return this;
    }
    /**
     * Log a warning message.
     * @param messages ...any[]
     * @returns FormattedLogger
     */
    warn(...messages) {
        this.__log('warn', colors[this.options.colors.warn], ...messages);
        return this;
    }
    /**
     * Log an error message.
     * @param messages ...any[]
     * @returns FormattedLogger
     */
    error(...messages) {
        this.__log('error', colors[this.options.colors.error], ...messages);
        return this;
    }
    /**
     * Log a message.
     * @param messages ...any[]
     * @returns FormattedLogger
     */
    log(...messages) {
        this.__log('log', colors[this.options.colors.log], ...messages);
        return this;
    }
}
