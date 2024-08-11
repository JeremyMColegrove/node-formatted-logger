import colors from 'colors'
//@ts-ignore
import {render} from './lib/prettyoutput.js'
import * as utils from './lib/utils.js'
import * as yamlTypes from './lib/types.js'

// import type { RendererOptions } from './types';
type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'log'

// omit any keys from yaml options here
type PublicYamlOptions = Omit<yamlTypes.Options, "dateTransform">

// the options available for the logger
type Options = {
	groupIndentation:number
	/**
	 * Convert a date into a string for printing. This applies to the logger and Objects/Arrays.
	 * @param date The current Date object.
	 * @returns string
	 */
	dateTransformer: (date: Date) => string
	/**
	 * Allowed log levels to pipe/print. 
	 */
	logLevels: LogLevel[]
	/**
	 * Options for printing objects and arrays in Yaml format.
	 */
	yamlOptions: yamlTypes.DeepPartial<PublicYamlOptions>
	/**
	 * If the logs should have color or not.
	 */
	noColor:boolean
	/**
	 * True if multiple arguments to logger should be auto grouped together.
	 */
	autoGroup:boolean
	/**
	 * Callback when a log is printed to the console. Used for pushing to file or buffer.
	 * @param log The string format of the rendered log
	 * @param level The LogLevel
	 * @returns {any}
	 */
	pipe: (log:string) => any
}

export const defaultOptions: Options = {
	groupIndentation:3,
	dateTransformer: (date) => date.toISOString(),
	logLevels: ['error', 'debug', 'log', 'warn', 'info'],
	yamlOptions: {enabled:true},
	pipe:console.log,
	noColor:false,
	autoGroup:true
}



export default class FormattedLogger {
	private groupLevel: number = 0 // Track the level of grouping
	private groupCount: number = 0 // Track the number of groups created
	// default options
	private options = defaultOptions
	constructor(options?: Partial<Options>) {
		this.options = utils.mergeDeep(this.options, options)
	}

	private colorString(thing:string, color:(text:string)=>string) {
		if (this.options.noColor) {
			return thing
		}
		return color(thing)
	}
	
	private header(level: string, color: (text: string) => string): string {
		const timestamp = this.options.dateTransformer(new Date())
		return `${this.colorString(`[${level.toUpperCase()}]`, color)}\t${this.colorString(`[${timestamp}]`, colors.gray)}\t`
	}

	private indent(): string {
		return ' '.repeat(this.groupLevel * this.options.groupIndentation) // Add indentation based on the group level
	}

	private formatMessage(message: any): string {
		if (typeof message === 'string') {
			return message
		}

		// return string if yaml disabled
		if (!this.options.yamlOptions.enabled) {
			return message
		}

		// render the yaml object
		var prettied = render(message, {...this.options.yamlOptions, dateTransform:this.options.dateTransformer, noColor:this.options.yamlOptions.noColor||this.options.noColor})
		if (prettied.trim().indexOf('\n') == -1) {
			return prettied.trim()
		}
		return this.colorString(`${utils.type(message)} Properties:`, colors[this.options.yamlOptions.colors?.keys||'white']) + '\n' + prettied
				.split('\n')
				.map((line:string, index:number) =>  ' '.repeat((this.groupLevel+1) * this.options.groupIndentation) + line)
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
	group(label?:string): FormattedLogger {
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
		this.__log('debug', colors.blue, ...messages)
		return this
	}
	/**
	 * Log an info message.
	 * @param messages ...any[]
	 * @returns FormattedLogger
	 */
	info(...messages: any[]): FormattedLogger {
		this.__log('info', colors.green, ...messages)
		return this
	}

	/**
	 * Log a warning message.
	 * @param messages ...any[]
	 * @returns FormattedLogger
	 */
	warn(...messages: any[]): FormattedLogger {
		this.__log('warn', colors.yellow, ...messages)
		return this
	}

	/**
	 * Log an error message.
	 * @param messages ...any[]
	 * @returns FormattedLogger
	 */
	error(...messages: any[]): FormattedLogger {
		this.__log('error', colors.red, ...messages)
		return this
	}

	/**
	 * Log a message.
	 * @param messages ...any[]
	 * @returns FormattedLogger
	 */
	log(...messages: any[]): FormattedLogger {
		this.__log('log', colors.gray, ...messages)
		return this
	}
}
