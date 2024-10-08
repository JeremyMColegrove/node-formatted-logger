import colors from 'colors'
export type Color = 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray' | 'grey' | 'black' | 
'bgBlack' | 'bgRed' | 'bgGreen' | 'bgYellow' | 'bgBlue' | 'bgMagenta' | 'bgCyan' | 'bgWhite'
| 'bold' | 'dim' | 'italic' | 'underline' | 'inverse' | 'hidden' | 'strikethrough' | 
'rainbow' | 'zebra' | 'america' | 'trap' | 'random' | 'strip' | 'reset'

export const colorMap:Record<Color, colors.Color> = {
	red: colors.red,
	green: colors.green,
	yellow: colors.yellow,
	blue: colors.blue,
	magenta: colors.magenta,
	cyan: colors.cyan,
	white: colors.white,
	gray: colors.gray,
	grey: colors.grey,
	black: colors.black,
	bgBlack: colors.bgBlack,
	bgRed: colors.bgRed,
	bgGreen: colors.bgGreen,
	bgYellow: colors.bgYellow,
	bgBlue: colors.bgBlue,
	bgMagenta: colors.bgMagenta,
	bgCyan: colors.bgCyan,
	bgWhite: colors.bgWhite,
	bold: colors.bold,
	dim: colors.dim,
	italic: colors.italic,
	underline: colors.underline,
	inverse: colors.inverse,
	hidden: colors.hidden,
	strikethrough: colors.strikethrough,
	rainbow: colors.rainbow,
	zebra: colors.zebra,
	america: colors.america,
	trap: colors.trap,
	random: colors.random,
	strip: colors.strip,
	reset: colors.reset
}


export interface Colors {
	debug: Color;
	error: Color;
	info: Color;
	warn: Color;
	log: Color;
	/**
	 * Color of object keys.
	 */
    keys: Color;
	/**
	 * Color for dates.
	 */
    date: Color
	/**
	 * Color for dashes in lists.
	 */
    dash: Color
	/**
	 * Color for all numbers.
	 */
    number: Color
	/**
	 * Color for all strings.
	 */
    string: Color
	/**
	 * Color for the boolean true.
	 */
    true: Color
	/**
	 * Color for the boolean false.
	 */
    false: Color
	/**
	 * Color for null type.
	 */
    null: Color
	/**
	 * Color for undefined type.
	 */
    undefined: Color
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'log'

export type YamlOptions = {
	/**
	 * Change the character used when indenting items. Default is ' '.
	 */
	indentationCharacter: string;
	/**
	 * Limit the depth of printing for objects, in case an object has cycles or a lot of embedded keys.
	 */
	maxDepth: number;
	
	/**
	 * Align the values of each key to each other.
	 */
	alignKeyValues: boolean;
	/**
	 * Print the arrays inline to save space when printing. Useful if you have large arrays.
	 */
	inlineArrays:boolean
	/**
	 * Enables/disables Yaml printing. If disabled, defaults to standard output for objects/arrays.
	 */
	enabled:boolean
}

export interface Options {
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
	 * The colors for the different types.
	 */
	colors: Colors;
	/**
	 * Options for printing objects and arrays in Yaml format.
	 */
	yamlOptions: YamlOptions
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
	pipe: (...logs:any[]) => any
}

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};