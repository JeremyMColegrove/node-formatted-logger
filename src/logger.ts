import ansis from 'ansis'

type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'log'

type Options = {
	dateFunc: (date:Date)=>string
	logLevels: LogLevel[]
}

export default class FormattedLogger {
	private groupCount: number = 0
	private grouped: boolean = false
	private options:Options = {
		dateFunc:(date)=>date.toISOString(), 
		logLevels:['error', 'debug', 'log', 'warn', 'info']
	}
	constructor (options?:Partial<Options>) {
		this.options = Object.assign(this.options, options)
	}
	
	private header(level: string, color: (text: string) => string): string {
		const timestamp = this.options.dateFunc(new Date())
		return `${color(`[${level.toUpperCase()}]`)}\t${ansis.gray(`[${timestamp}]`)}\t`
	}

	private getGroupLabel(level: string): string {
		return `Log Group ${this.groupCount}: ${level.toUpperCase()}`
	}

	private __log(level: LogLevel, color: (text: string) => string, ...messages: any[]): void {
		if (!this.options.logLevels?.includes(level)) return

		if (messages.length > 1) {
			this.groupCount++
			const groupLabel = this.getGroupLabel(level)
			this.group(level)
			messages.forEach((message) => {
				console.log(this.header(level,color), message)
			})
			if (this.grouped && console.groupEnd) {
				console.groupEnd()
				console.log(ansis.dim(groupLabel + " END"))
			}
		} else {
			console.log(this.header(level,color), messages[0])
		}
	}

	updateOptions(options:Options):FormattedLogger {
		this.options = Object.assign(this.options, options)
		return this
	}

	group(level: LogLevel):FormattedLogger {
		this.grouped = true
		if (console && console.groupCollapsed) {
			console.groupCollapsed(ansis.dim(this.getGroupLabel(level)))
		}
		return this
	}

	ungroup():FormattedLogger {
		this.grouped = false
		if (console && console.groupEnd) {
			console.groupEnd()
		}
		return this
	}

	debug(...messages: any[]):FormattedLogger {
		this.__log('debug', ansis.blue, ...messages)
		return this
	}

	info(...messages: any[]):FormattedLogger {
		this.__log('info', ansis.green, ...messages)
		return this
	}

	warn(...messages: any[]):FormattedLogger {
		this.__log('warn', ansis.yellow, ...messages)
		return this
	}

	error(...messages: any[]):FormattedLogger {
		this.__log('error', ansis.red, ...messages)
		return this
	}

	log(...messages: any[]):FormattedLogger {
		this.__log('log', ansis.gray, ...messages)
		return this
	}
}
