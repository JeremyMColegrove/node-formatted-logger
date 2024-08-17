import colors from 'colors/safe.js'
import { colorMap } from './types.js'
//@ts-ignore
import {render} from './lib/prettyoutput.js'
import * as utils from './lib/utils.js'
import { DeepPartial, LogLevel, Options } from './types'

export const defaultOptions: Options = {
	groupIndentation:3,
	dateTransformer: (date) => date.toLocaleString(),
	logLevels: ['error', 'debug', 'log', 'warn', 'info'],
	colors: {
		info:'blue',
		log:'reset',
		warn:'yellow',
		debug:'cyan',
		error:'red',
		dash:'green',
		date:'magenta',
		null:'dim',
		number:'yellow',
		string:'reset',
		undefined:'dim',
		true:'yellow',
		false:'yellow',
		keys:'green'
	},
	yamlOptions: {
		maxDepth:6,
		
		enabled:true,
		inlineArrays:false,
		alignKeyValues:true,
		indentationCharacter:' '
	},
	pipe:console.log,
	noColor:false,
	autoGroup:true
}



export default class FormattedLogger {
	private groupLevel: number = 0 // Track the level of grouping
	private groupCount: number = 0 // Track the number of groups created
	// default options
	private options = defaultOptions
	
	constructor(options?: DeepPartial<Options>) {
		this.options = utils.mergeDeep(this.options, options)
	}

	static stripColors(...args:any[]) {
		// reset all colors and pass back
		return args.map(arg=>colors.stripColors(arg))
	}

	private colorString(thing:string, color:(text:string)=>string) {
		if (this.options.noColor) {
			return thing
		}
		return color(thing)
	}
	
	private header(level: string, color: (text: string) => string): string {
		const timestamp = this.options.dateTransformer(new Date())
		if (this.options.noColor) {
			return `[${level.toUpperCase()}]\t[${timestamp}]\t`
		}
		return `${this.colorString(`[${level.toUpperCase()}]`, color)}\t${this.colorString(`[${timestamp}]`, colors.gray)}\t`
	}

	private indent(): string {
		return ' '.repeat(this.groupLevel * this.options.groupIndentation) // Add indentation based on the group level
	}

	private formatMessage(message: any): string {
		// return string if yaml disabled
		if (!this.options.yamlOptions.enabled) {
			return message
		}

		// render the yaml object
		var prettied = render(message, this.options)
		if (prettied.trim().indexOf('\n') == -1) {
			return prettied.trim()
		}
		return this.colorString(`${utils.type(message)} Properties:`, colorMap[this.options.colors.string]) + '\n' + prettied
				.split('\n')
				.map((line:string) =>  ' '.repeat((this.groupLevel+1) * this.options.groupIndentation) + line)
				.join('\n');
	}

	private getGroupLabel(): string {
		return `Log Group ${this.groupCount}`
	}

	private __log(level: LogLevel, color: (text: string) => string, ...messages: any[]): void {
		if (!this.options.logLevels?.includes(level)) return
		if (messages.length > 1) {
			this.options.autoGroup && this.group()
			messages.forEach((message) => {
				var header = this.indent() + this.header(level, color)
				var rendered = this.formatMessage(message)
				this.options.pipe(`${header} ${rendered}`)
			})
			this.options.autoGroup && this.ungroup() // Automatically end the group
		} else {
			var header = this.indent() + this.header(level, color)
			var rendered =this.formatMessage(messages[0])
			this.options.pipe(`${header} ${rendered}`)
		}
	}

	/**
	 * Starts a grouping of logs
	 * @param label Label header text
	 * @returns FormattedLogger
	 */
	group(label?:string|null): FormattedLogger {
		this.options.pipe(this.indent() + this.colorString(`${this.getGroupLabel()}${label?`: ${label}`:''}`, colors.dim))
		this.groupLevel++ // Increase the group level
		return this
	}

	/**
	 * Ends a grouping of logs
	 * @returns FormattedLogger
	 */
	ungroup(): FormattedLogger {
		if (this.groupLevel > 0) {
			this.groupLevel-- // Decrease the group level
			this.options.pipe(this.indent() + this.colorString(`${this.getGroupLabel()} END`, colors.dim))
			this.groupCount++
		}
		return this
	}

	/**
	 * Log a debug message.
	 * @param messages ...any[]
	 * @returns FormattedLogger
	 */
	debug(...messages: any[]): FormattedLogger {
		this.__log('debug', colorMap[this.options.colors.debug], ...messages)
		return this
	}
	/**
	 * Log an info message.
	 * @param messages ...any[]
	 * @returns FormattedLogger
	 */
	info(...messages: any[]): FormattedLogger {
		this.__log('info', colorMap[this.options.colors.info], ...messages)
		return this
	}

	/**
	 * Log a warning message.
	 * @param messages ...any[]
	 * @returns FormattedLogger
	 */
	warn(...messages: any[]): FormattedLogger {
		this.__log('warn', colorMap[this.options.colors.warn], ...messages)
		return this
	}

	/**
	 * Log an error message.
	 * @param messages ...any[]
	 * @returns FormattedLogger
	 */
	error(...messages: any[]): FormattedLogger {
		this.__log('error', colorMap[this.options.colors.error], ...messages)
		return this
	}

	/**
	 * Log a message.
	 * @param messages ...any[]
	 * @returns FormattedLogger
	 */
	log(...messages: any[]): FormattedLogger {
		this.__log('log', colorMap[this.options.colors.log], ...messages)
		return this
	}
}
