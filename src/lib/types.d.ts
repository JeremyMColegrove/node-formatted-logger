
export type Color = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' 
                            | 'gray' | 'grey' | 'bold' | 'dim' | 'italic' | 'underline' | 'hidden' | 'strikethrough' | 'rainbow' | 'zebra'
                            | 'america' | 'trap' | 'random' | 'zalgo' | 'strip'

export interface Colors {
    keys: Color;
    date: Color
    dash: Color
    number: Color
    string: Color
    true: Color
    false: Color
    null: Color
    undefined: Color
}

export interface Options {
    indentationCharacter: string;
    maxDepth: number;
    noColor: boolean;
    colors: Colors;
    alignKeyValues: boolean;
    inlineArrays:boolean
    enabled:boolean
    dateTransform:(date:Date)=>string
}

declare type DeepPartial<T> = T extends any[] ? T : { [P in keyof T]?: DeepPartial<T[P]> }