import FormattedLogger from "../logger";
import fs from 'fs'



var buffer:string[] = []

var f = new FormattedLogger({
    pipe:(...args:any[]) => {
        // output to console
        console.log(...args)
    }, 
    dateTransformer:(date:Date)=>date.toDateString(), 
    noColor:false,
    autoGroup:true,
    yamlOptions: {
      colors: {
        keys: 'reset'
      }
    }
})

// do whatever logging
f.group("Test Error")
f.error("Error has been encountered. Aborting.")
f.warn({
date: new Date(),
installs:1,
author:"Jeremy Colegrove <jeremycolegrove@gmail.com> (https://github.com/JeremyMColegrove)",
name:"formatted-logger",
repository:{
    "type": "git",
    "url": "git+https://github.com/JeremyMColegrove/node-formatted-logger.git"
  },
keywords: [
    "logger",
    "log",
    "format",
    "beautiful",
  ],
})
f.info("Recovered. Continuing as normal.")
f.ungroup()
f.info("Processing time took 234ms")