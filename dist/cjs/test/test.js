"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const fs_1 = __importDefault(require("fs"));
var buffer = [];
var f = new logger_1.default({
    pipe: (...args) => {
        // output to console
        console.log(...args);
        // push to buffer
        buffer.push(...args);
    },
    dateTransformer: (date) => date.toDateString(),
    noColor: false,
    autoGroup: true,
    yamlOptions: {
        inlineArrays: false,
        enabled: true
    }
});
// do whatever logging
f.group("Test Error");
f.error("Error has been encountered. Aborting.");
f.warn({
    date: new Date(),
    installs: 1,
    author: "Jeremy Colegrove <jeremycolegrove@gmail.com> (https://github.com/JeremyMColegrove)",
    name: "formatted-logger",
    repository: {
        "type": "git",
        "url": "git+https://github.com/JeremyMColegrove/node-formatted-logger.git"
    },
    keywords: [
        "logger",
        "log",
        "format",
        "beautiful",
    ],
});
f.info("Recovered. Continuing as normal.");
f.ungroup();
f.info("Processing time took 234ms");
// f.error({this:null, is:undefined, an:[], object:[1,2,3], embedd:{a:{c:{c:[1,2,3, "hello", new Date()]}}}})
// flush buffer
fs_1.default.writeFileSync('./output.txt', buffer.join('\n'), 'utf8');
