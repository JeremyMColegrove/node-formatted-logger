import ansis from 'ansis'

type LoggerLevel = 'error' | 'warn' | 'info' | 'debug' | 'log'

export default class FormattedLogger {
	private static groupCount: number = 0
	private static grouped: boolean = false
	private static levels:LoggerLevel[] = ['error', 'debug', 'log', 'warn', 'info']
	private static formatTime:(date:Date)=>any = (date)=>date.toISOString()
	// private static errorTypes = [Error, EvalError, TypeError, MediaError, RangeError, SyntaxError, AggregateError, ReferenceError, SuppressedError, WebTransportError, OverconstrainedError, SpeechSynthesisErrorEvent, Error]
	private static formatMessage(level: string, message: any, color: (text: string) => string): string {

		const timestamp = this.formatTime(new Date())

		// const formattedMessage = typeof message === 'string' ? message : JSON.stringify(message, null, 2)
		// Check if message is an Error and format it accordingly
		if (typeof message == 'string') {
			let formattedMessage = message
			return `${color(`[${level.toUpperCase()}]`)}\t${ansis.gray(`[${timestamp}]`)}\t${formattedMessage}`
		}
		return `${color(`[${level.toUpperCase()}]`)}\t${ansis.gray(`[${timestamp}]:`)}\t`
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

	private static getGroupLabel(level: string): string {
		return `Log Group ${FormattedLogger.groupCount}: ${level.toUpperCase()}`
	}

	private static __log(level: LoggerLevel, color: (text: string) => string, ...messages: any[]): void {
		if (!FormattedLogger.levels?.includes(level)) return

		if (messages.length > 1) {
			FormattedLogger.groupCount++
			const groupLabel = FormattedLogger.getGroupLabel(level)
			!FormattedLogger.grouped && console.groupCollapsed && console.groupCollapsed(ansis.dim(groupLabel))
			messages.forEach((message) => {
				console.log(typeof message)
				console.log(FormattedLogger.formatMessage(level, message, color))
				if (typeof message == 'object') {
					console.log(message)
				}
			})
			!FormattedLogger.grouped && console.groupEnd && console.groupEnd()
		} else {
			console.log(FormattedLogger.formatMessage(level, messages[0], color))
		}
	}

	static setTimeFormat(func:(date:Date)=>any):FormattedLogger {
		this.formatTime = func
		return this
	}

	static setLevel(levels:LoggerLevel[]):FormattedLogger {
		FormattedLogger.levels = levels
		return this
	}

	static group(level: LoggerLevel):FormattedLogger {
		FormattedLogger.grouped = true
		if (console && console.groupCollapsed) {
			console.groupCollapsed(ansis.dim(FormattedLogger.getGroupLabel(level)))
		}
		return this
	}

	static ungroup():FormattedLogger {
		FormattedLogger.grouped = false
		if (console && console.groupEnd) {
			console.groupEnd()
		}
		return this
	}

	static debug(...messages: any[]):FormattedLogger {
		FormattedLogger.__log('debug', ansis.blue, ...messages)
		return this
	}

	static info(...messages: any[]):FormattedLogger {
		FormattedLogger.__log('info', ansis.green, ...messages)
		return this
	}

	static warn(...messages: any[]):FormattedLogger {
		FormattedLogger.__log('warn', ansis.yellow, ...messages)
		return this
	}

	static error(...messages: any[]):FormattedLogger {
		FormattedLogger.__log('error', ansis.red, ...messages)
		return this
	}

	static log(...messages: any[]):FormattedLogger {
		FormattedLogger.__log('log', ansis.gray, ...messages)
		return this
	}
}
