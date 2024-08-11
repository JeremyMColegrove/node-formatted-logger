import * as yamlTypes from './lib/types.js';
type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'log';
type PublicYamlOptions = Omit<yamlTypes.Options, "dateTransform">;
type Options = {
    groupIndentation: number;
    /**
     * Convert a date into a string for printing. This applies to the logger and Objects/Arrays.
     * @param date The current Date object.
     * @returns string
     */
    dateTransformer: (date: Date) => string;
    /**
     * Allowed log levels to pipe/print.
     */
    logLevels: LogLevel[];
    /**
     * Options for printing objects and arrays in Yaml format.
     */
    yamlOptions: yamlTypes.DeepPartial<PublicYamlOptions>;
    /**
     * If the logs should have color or not.
     */
    noColor: boolean;
    /**
     * True if multiple arguments to logger should be auto grouped together.
     */
    autoGroup: boolean;
    /**
     * Callback when a log is printed to the console. Used for pushing to file or buffer.
     * @param log The string format of the rendered log
     * @param level The LogLevel
     * @returns {any}
     */
    pipe: (log: string) => any;
};
export declare const defaultOptions: Options;
export default class FormattedLogger {
    private groupLevel;
    private groupCount;
    private options;
    constructor(options?: Partial<Options>);
    private colorString;
    private header;
    private indent;
    private formatMessage;
    private getGroupLabel;
    private __log;
    /**
     * Starts a grouping of logs
     * @param label Label header text
     * @returns FormattedLogger
     */
    group(label?: string): FormattedLogger;
    /**
     * Ends a grouping of logs
     * @returns FormattedLogger
     */
    ungroup(): FormattedLogger;
    /**
     * Log a debug message.
     * @param messages ...any[]
     * @returns FormattedLogger
     */
    debug(...messages: any[]): FormattedLogger;
    /**
     * Log an info message.
     * @param messages ...any[]
     * @returns FormattedLogger
     */
    info(...messages: any[]): FormattedLogger;
    /**
     * Log a warning message.
     * @param messages ...any[]
     * @returns FormattedLogger
     */
    warn(...messages: any[]): FormattedLogger;
    /**
     * Log an error message.
     * @param messages ...any[]
     * @returns FormattedLogger
     */
    error(...messages: any[]): FormattedLogger;
    /**
     * Log a message.
     * @param messages ...any[]
     * @returns FormattedLogger
     */
    log(...messages: any[]): FormattedLogger;
}
export {};
