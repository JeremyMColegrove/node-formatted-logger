import colors from 'colors'
//@ts-ignore
import {render} from './lib/prettyoutput'
import * as utils from './lib/utils'
import * as yamlTypes from './lib/types'

// import type { RendererOptions } from './types';
type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'log'

type Options = {
	groupIndentation:number
	dateTransformer: (date: Date) => string
	logLevels: LogLevel[]
	yamlOptions: yamlTypes.DeepPartial<yamlTypes.Options>
	noColor:boolean
	/**
	 * Callback when a log is printed to the console. Used for pushing to file or buffer.
	 * @param log The string format of the rendered log
	 * @param level The LogLevel
	 * @returns {any}
	 */
	pipe: (...args:any[]) => any
}

export default class FormattedLogger {
	private groupLevel: number = 0 // Track the level of grouping
	private groupCount: number = 0 // Track the number of groups created
	private options: Options = {
		groupIndentation:3,
		dateTransformer: (date) => date.toISOString(),
		logLevels: ['error', 'debug', 'log', 'warn', 'info'],
		yamlOptions: {enabled:true},
		pipe:console.log,
		noColor:false
	}

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

		return this.colorString(utils.type(message), colors.cyan) + '\n' + prettied
				.split('\n')
				.map((line:string, index:number) =>  (index>1?this.indent():'') + ' '.repeat(this.options.groupIndentation) + line)
				.join('\n');
	}

	private getGroupLabel(): string {
		return `Log Group ${this.groupCount}`
	}

	private __log(level: LogLevel, color: (text: string) => string, ...messages: any[]): void {
		if (!this.options.logLevels?.includes(level)) return
		const args:string[] = []
		if (messages.length > 1) {
			this.group()
			messages.forEach((message) => {
				var header = this.indent() + this.header(level, color)
				var rendered = this.formatMessage(message)
				args.push(`${header} ${rendered}`)
				// this.options.pipe(header, rendered)
				// this.options.pipe && this.options.pipe(rendered, header, level)
			})
			this.options.pipe(...args)
			this.ungroup() // Automatically end the group
		} else {
			var header = this.indent() + this.header(level, color)
			var rendered =this.formatMessage(messages[0])
			this.options.pipe(`${header} ${rendered}`)
		}
	}

	updateOptions(options: Options): FormattedLogger {
		this.options = Object.assign(this.options, options)
		return this
	}

	group(label?:string): FormattedLogger {
		this.options.pipe(this.indent() + this.colorString(`${this.getGroupLabel()}${label?`: ${label}`:''}`, colors.dim))
		this.groupLevel++ // Increase the group level
		return this
	}

	ungroup(): FormattedLogger {
		if (this.groupLevel > 0) {
			this.groupLevel-- // Decrease the group level
			this.options.pipe(this.indent() + this.colorString(`${this.getGroupLabel()} END`, colors.dim))
			this.groupCount++
		}
		return this
	}

	debug(...messages: any[]): FormattedLogger {
		this.__log('debug', colors.blue, ...messages)
		return this
	}

	info(...messages: any[]): FormattedLogger {
		this.__log('info', colors.green, ...messages)
		return this
	}

	warn(...messages: any[]): FormattedLogger {
		this.__log('warn', colors.yellow, ...messages)
		return this
	}

	error(...messages: any[]): FormattedLogger {
		this.__log('error', colors.red, ...messages)
		return this
	}

	log(...messages: any[]): FormattedLogger {
		this.__log('log', colors.gray, ...messages)
		return this
	}
}
