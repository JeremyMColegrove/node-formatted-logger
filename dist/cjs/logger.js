"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansis_1 = __importDefault(require("ansis"));
class FormattedLogger {
    // private static errorTypes = [Error, EvalError, TypeError, MediaError, RangeError, SyntaxError, AggregateError, ReferenceError, SuppressedError, WebTransportError, OverconstrainedError, SpeechSynthesisErrorEvent, Error]
    static formatMessage(level, message, color) {
        const timestamp = this.formatTime(new Date());
        // const formattedMessage = typeof message === 'string' ? message : JSON.stringify(message, null, 2)
        // Check if message is an Error and format it accordingly
        if (typeof message == 'string') {
            let formattedMessage = message;
            return `${color(`[${level.toUpperCase()}]`)}\t${ansis_1.default.gray(`[${timestamp}]`)}\t${formattedMessage}`;
        }
        return `${color(`[${level.toUpperCase()}]`)}\t${ansis_1.default.gray(`[${timestamp}]:`)}\t`;
        // if (message instanceof Error) {
        // formattedMessage = `Error: ${message.message}\nStack: ${message.stack}`
        // if (typeof message !== 'string') {
        // 	// Attempt to stringify non-string, non-Error messages
        // 	try {
        // 		formattedMessage = JSON.stringify(message, null, 2)
        // 	} catch (error) {
        // 		formattedMessage = 'Failed to stringify message'
        // 	}
        // }
    }
    static getGroupLabel(level) {
        return `Log Group ${FormattedLogger.groupCount}: ${level.toUpperCase()}`;
    }
    static __log(level, color, ...messages) {
        var _a;
        if (!((_a = FormattedLogger.levels) === null || _a === void 0 ? void 0 : _a.includes(level)))
            return;
        if (messages.length > 1) {
            FormattedLogger.groupCount++;
            const groupLabel = FormattedLogger.getGroupLabel(level);
            !FormattedLogger.grouped && console.groupCollapsed && console.groupCollapsed(ansis_1.default.dim(groupLabel));
            messages.forEach((message) => {
                console.log(typeof message);
                console.log(FormattedLogger.formatMessage(level, message, color));
                if (typeof message == 'object') {
                    console.log(message);
                }
            });
            !FormattedLogger.grouped && console.groupEnd && console.groupEnd();
        }
        else {
            console.log(FormattedLogger.formatMessage(level, messages[0], color));
        }
    }
    static setTimeFormat(func) {
        this.formatTime = func;
        return this;
    }
    static setLevel(levels) {
        FormattedLogger.levels = levels;
        return this;
    }
    static group(level) {
        FormattedLogger.grouped = true;
        if (console && console.groupCollapsed) {
            console.groupCollapsed(ansis_1.default.dim(FormattedLogger.getGroupLabel(level)));
        }
        return this;
    }
    static ungroup() {
        FormattedLogger.grouped = false;
        if (console && console.groupEnd) {
            console.groupEnd();
        }
        return this;
    }
    static debug(...messages) {
        FormattedLogger.__log('debug', ansis_1.default.blue, ...messages);
        return this;
    }
    static info(...messages) {
        FormattedLogger.__log('info', ansis_1.default.green, ...messages);
        return this;
    }
    static warn(...messages) {
        FormattedLogger.__log('warn', ansis_1.default.yellow, ...messages);
        return this;
    }
    static error(...messages) {
        FormattedLogger.__log('error', ansis_1.default.red, ...messages);
        return this;
    }
    static log(...messages) {
        FormattedLogger.__log('log', ansis_1.default.gray, ...messages);
        return this;
    }
}
FormattedLogger.groupCount = 0;
FormattedLogger.grouped = false;
FormattedLogger.levels = ['error', 'debug', 'log', 'warn', 'info'];
FormattedLogger.formatTime = (date) => date.toISOString();
exports.default = FormattedLogger;
