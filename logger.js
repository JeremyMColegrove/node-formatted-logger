var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import ansis from 'ansis';
var FormattedLogger = /** @class */ (function () {
    function FormattedLogger() {
    }
    FormattedLogger.formatMessage = function (level, message, color) {
        var timestamp = new Date().toISOString();
        // const formattedMessage = typeof message === 'string' ? message : JSON.stringify(message, null, 2)
        // Check if message is an Error and format it accordingly
        var formattedMessage = message;
        if (message instanceof Error) {
            formattedMessage = "Error: ".concat(message.message, "\nStack: ").concat(message.stack);
        }
        else if (typeof message !== 'string') {
            // Attempt to stringify non-string, non-Error messages
            try {
                formattedMessage = JSON.stringify(message, null, 2);
            }
            catch (error) {
                formattedMessage = 'Failed to stringify message';
            }
        }
        return "".concat(color("[".concat(level.toUpperCase(), "]")), "\t").concat(ansis.gray("[".concat(timestamp, "]")), "\t").concat(formattedMessage);
    };
    FormattedLogger.getGroupLabel = function (level) {
        return "Log Group ".concat(FormattedLogger.groupCount, ": ").concat(level.toUpperCase());
    };
    FormattedLogger.__log = function (level, color) {
        var _a;
        var messages = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            messages[_i - 2] = arguments[_i];
        }
        if (!((_a = FormattedLogger.levels) === null || _a === void 0 ? void 0 : _a.includes(level)))
            return;
        if (messages.length > 1) {
            FormattedLogger.groupCount++;
            var groupLabel = FormattedLogger.getGroupLabel(level);
            !FormattedLogger.grouped && console.groupCollapsed && console.groupCollapsed(ansis.dim(groupLabel));
            messages.forEach(function (message) {
                console.log(FormattedLogger.formatMessage(level, message, color));
            });
            !FormattedLogger.grouped && console.groupEnd && console.groupEnd();
        }
        else {
            console.log(FormattedLogger.formatMessage(level, messages[0], color));
        }
    };
    FormattedLogger.group = function (level) {
        FormattedLogger.grouped = true;
        if (console && console.groupCollapsed) {
            console.groupCollapsed(ansis.dim(FormattedLogger.getGroupLabel(level)));
        }
    };
    FormattedLogger.ungroup = function () {
        FormattedLogger.grouped = false;
        if (console && console.groupEnd) {
            console.groupEnd();
        }
    };
    FormattedLogger.debug = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        FormattedLogger.__log.apply(FormattedLogger, __spreadArray(['debug', ansis.blue], messages, false));
    };
    FormattedLogger.info = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        FormattedLogger.__log.apply(FormattedLogger, __spreadArray(['info', ansis.green], messages, false));
    };
    FormattedLogger.warn = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        FormattedLogger.__log.apply(FormattedLogger, __spreadArray(['warn', ansis.yellow], messages, false));
    };
    FormattedLogger.error = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        FormattedLogger.__log.apply(FormattedLogger, __spreadArray(['error', ansis.red], messages, false));
    };
    FormattedLogger.log = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        FormattedLogger.__log.apply(FormattedLogger, __spreadArray(['log', ansis.gray], messages, false));
    };
    FormattedLogger.groupCount = 0;
    FormattedLogger.grouped = false;
    FormattedLogger.levels = ['error', 'debug', 'log', 'warn', 'info'];
    return FormattedLogger;
}());
export default FormattedLogger;
