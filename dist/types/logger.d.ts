type LoggerLevel = 'error' | 'warn' | 'info' | 'debug' | 'log';
export default class FormattedLogger {
    private static groupCount;
    private static grouped;
    private static levels;
    private static formatTime;
    private static formatMessage;
    private static getGroupLabel;
    private static __log;
    static setTimeFormat(func: (date: Date) => any): FormattedLogger;
    static setLevel(levels: LoggerLevel[]): FormattedLogger;
    static group(level: LoggerLevel): FormattedLogger;
    static ungroup(): FormattedLogger;
    static debug(...messages: any[]): FormattedLogger;
    static info(...messages: any[]): FormattedLogger;
    static warn(...messages: any[]): FormattedLogger;
    static error(...messages: any[]): FormattedLogger;
    static log(...messages: any[]): FormattedLogger;
}
export {};
