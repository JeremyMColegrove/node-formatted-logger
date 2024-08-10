import FormattedLogger from "../logger";
import fs from 'fs'



var buffer:string[] = []

var f = new FormattedLogger({
    pipe:(...args:any[]) => {
        // output to console
        console.log(...args)
        // push to buffer
        buffer.push(...args)
    }, 
    dateTransformer:(date:Date)=>date.toDateString(), 
    noColor:true,
    yamlOptions:{
        inlineArrays:true, 
        enabled:true,
    }
})

// do whatever logging
f.error({this:null, is:undefined, an:[], object:[1,2,3], embedd:{a:{c:{c:[1,2,3, "hello", new Date()]}}}})

// flush buffer
fs.writeFileSync('./output.txt', buffer.join('\n'), 'utf8');