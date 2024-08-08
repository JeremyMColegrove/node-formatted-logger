import ansis from 'ansis'

type LoggerLevel = 'error' | 'warn' | 'info' | 'debug' | 'log'

export default class FormattedLogger {
	private static groupCount: number = 0
	private static grouped: boolean = false
	private static levels:LoggerLevel[] = ['error', 'debug', 'log', 'warn', 'info']

	private static formatMessage(level: string, message: any, color: (text: string) => string): string {
		const timestamp = new Date().toISOString()

		// const formattedMessage = typeof message === 'string' ? message : JSON.stringify(message, null, 2)
		// Check if message is an Error and format it accordingly
		let formattedMessage = message
		if (message instanceof Error) {
			formattedMessage = `Error: ${message.message}\nStack: ${message.stack}`
		} else if (typeof message !== 'string') {
			// Attempt to stringify non-string, non-Error messages
			try {
				formattedMessage = JSON.stringify(message, null, 2)
			} catch (error) {
				formattedMessage = 'Failed to stringify message'
			}
		}

		return `${color(`[${level.toUpperCase()}]`)}\t${ansis.gray(`[${timestamp}]`)}\t${formattedMessage}`
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
				console.log(FormattedLogger.formatMessage(level, message, color))
			})
			!FormattedLogger.grouped && console.groupEnd && console.groupEnd()
		} else {
			console.log(FormattedLogger.formatMessage(level, messages[0], color))
		}
	}

	static group(level: LoggerLevel) {
		FormattedLogger.grouped = true
		if (console && console.groupCollapsed) {
			console.groupCollapsed(ansis.dim(FormattedLogger.getGroupLabel(level)))
		}
	}

	static ungroup() {
		FormattedLogger.grouped = false
		if (console && console.groupEnd) {
			console.groupEnd()
		}
	}

	static debug(...messages: any[]): void {
		FormattedLogger.__log('debug', ansis.blue, ...messages)
	}

	static info(...messages: any[]): void {
		FormattedLogger.__log('info', ansis.green, ...messages)
	}

	static warn(...messages: any[]): void {
		FormattedLogger.__log('warn', ansis.yellow, ...messages)
	}

	static error(...messages: any[]): void {
		FormattedLogger.__log('error', ansis.red, ...messages)
	}

	static log(...messages: any[]): void {
		FormattedLogger.__log('log', ansis.gray, ...messages)
	}
}
