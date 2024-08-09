import ansis from 'ansis';
export default class FormattedLogger {
    constructor(options) {
        this.groupCount = 0;
        this.grouped = false;
        this.options = {
            dateFunc: (date) => date.toISOString(),
            logLevels: ['error', 'debug', 'log', 'warn', 'info']
        };
        this.options = Object.assign(this.options, options);
    }
    header(level, color) {
        const timestamp = this.options.dateFunc(new Date());
        return `${color(`[${level.toUpperCase()}]`)}\t${ansis.gray(`[${timestamp}]`)}\t`;
    }
    getGroupLabel(level) {
        return `Log Group ${this.groupCount}: ${level.toUpperCase()}`;
    }
    __log(level, color, ...messages) {
        var _a;
        if (!((_a = this.options.logLevels) === null || _a === void 0 ? void 0 : _a.includes(level)))
            return;
        if (messages.length > 1) {
            this.groupCount++;
            const groupLabel = this.getGroupLabel(level);
            if (!this.grouped && console.groupCollapsed) {
                console.groupCollapsed(ansis.dim(groupLabel));
                this.grouped = true;
            }
            messages.forEach((message) => {
                console.log(this.header(level, color), message);
            });
            if (this.grouped && console.groupEnd) {
                console.groupEnd();
                console.log(ansis.dim(groupLabel + " END"));
            }
        }
        else {
            console.log(this.header(level, color), messages[0]);
        }
    }
    updateOptions(options) {
        this.options = Object.assign(this.options, options);
        return this;
    }
    group(level) {
        this.grouped = true;
        if (console && console.groupCollapsed) {
            console.groupCollapsed(ansis.dim(this.getGroupLabel(level)));
        }
        return this;
    }
    ungroup() {
        this.grouped = false;
        if (console && console.groupEnd) {
            console.groupEnd();
        }
        return this;
    }
    debug(...messages) {
        this.__log('debug', ansis.blue, ...messages);
        return this;
    }
    info(...messages) {
        this.__log('info', ansis.green, ...messages);
        return this;
    }
    warn(...messages) {
        this.__log('warn', ansis.yellow, ...messages);
        return this;
    }
    error(...messages) {
        this.__log('error', ansis.red, ...messages);
        return this;
    }
    log(...messages) {
        this.__log('log', ansis.gray, ...messages);
        return this;
    }
}
