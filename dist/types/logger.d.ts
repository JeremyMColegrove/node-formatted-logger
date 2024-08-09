type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'log';
type Options = {
    dateFunc: (date: Date) => string;
    logLevels: LogLevel[];
};
export default class FormattedLogger {
    private groupCount;
    private grouped;
    private options;
    constructor(options?: Partial<Options>);
    private header;
    private getGroupLabel;
    private __log;
    updateOptions(options: Options): FormattedLogger;
    group(level: LogLevel): FormattedLogger;
    ungroup(): FormattedLogger;
    debug(...messages: any[]): FormattedLogger;
    info(...messages: any[]): FormattedLogger;
    warn(...messages: any[]): FormattedLogger;
    error(...messages: any[]): FormattedLogger;
    log(...messages: any[]): FormattedLogger;
}
export {};
