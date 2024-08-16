import { DeepPartial, Options } from './types';
export declare const defaultOptions: Options;
export default class FormattedLogger {
    private groupLevel;
    private groupCount;
    private options;
    constructor(options?: DeepPartial<Options>);
    static stripColors(...args: any[]): string[];
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
    group(label?: string | null): FormattedLogger;
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
