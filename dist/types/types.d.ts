export type Color = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray' | 'grey' | 'bold' | 'dim' | 'italic' | 'underline' | 'hidden' | 'strikethrough' | 'rainbow' | 'zebra' | 'america' | 'trap' | 'random' | 'zalgo' | 'strip';
export interface Colors {
    keys: Color;
    date: Color;
    dash: Color;
    number: Color;
    string: Color;
    true: Color;
    false: Color;
    null: Color;
    undefined: Color;
}
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'log';
export interface Options {
    groupIndentation: number;
    /**
     * Convert a date into a string for printing. This applies to the logger and Objects/Arrays.
     * @param date The current Date object.
     * @returns string
     */
    dateTransformer: (date: Date) => string;
    /**
     * Allowed log levels to pipe/print.
     */
    logLevels: LogLevel[];
    /**
     * Options for printing objects and arrays in Yaml format.
     */
    yamlOptions: {
        indentationCharacter: string;
        maxDepth: number;
        noColor: boolean;
        colors: Colors;
        alignKeyValues: boolean;
        inlineArrays: boolean;
        enabled: boolean;
    };
    /**
     * If the logs should have color or not.
     */
    noColor: boolean;
    /**
     * True if multiple arguments to logger should be auto grouped together.
     */
    autoGroup: boolean;
    /**
     * Callback when a log is printed to the console. Used for pushing to file or buffer.
     * @param log The string format of the rendered log
     * @param level The LogLevel
     * @returns {any}
     */
    pipe: (...logs: any[]) => any;
}
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
