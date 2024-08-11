#!/usr/bin/env node
'use strict'

import FormattedLogger from '../dist/esm/index.js'
import { fileURLToPath } from 'url'

import fs from 'fs'
import colors from 'colors/safe.js'
import { Command } from 'commander/esm.mjs'
import { createRequire } from 'module';
import path from 'path';

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const packageJson = require(path.join(__dirname, '../package.json'));

const program = new Command()
program
    .usage('[options] <file ...>')
    .version(packageJson.version)
    .option('-n, --noColor', 'Disable color')
    .option('--maxDepth [maxDepth]', 'Max depth inspection', parseInt)
    .option('-m, --message <message>', 'Message to log')
    .option('-e, --error', 'Log as error', false)
    .option('-w, --warn', 'Log as warning', false)
    .option('-l, --log', 'Log as regular log', false)
    .option('-d, --debug', 'Log as debug', false)
    .option('-i, --info', 'Log as info', false)
    .parse(process.argv)

// console.log(program)
const options = {
    noColor: program.getOptionValue('noColor'),
    maxDepth: program.getOptionValue('maxDepth'),
    warn:program.getOptionValue('warn'),
    error:program.getOptionValue('error'),
    log:program.getOptionValue('log'),
    info:program.getOptionValue('info'),
    debug:program.getOptionValue('debug'),
    message:program.getOptionValue('message'),
}

const renderInput = function (data) {
    let input = data
    try {
        input = JSON.parse(data)
    } catch (e) {
        if (program.debug) console.error(`${colors.red('Error:')} unparsable content`) //eslint-disable-line no-console
    }
    // console.log(options)
    var lgr = new FormattedLogger({
        noColor:options.noColor,
        yamlOptions: {
            maxDepth:options.maxDepth,
        }
    })
    if (options.error) {
        lgr.error(input)
    }
    if (options.warn) {
        lgr.warn(input)
    }
    if (options.debug) {
        lgr.debug(input)
    }
    if (options.log) {
        lgr.log(input)
    }
    if (options.info) {
        lgr.info(input)
    }
    if (!options.error && !options.warn && !options.debug && !options.log && !options.info) {
        lgr.log(input)
    }
}
// console.log(program)
if (program.args.length || options.message) {
    try {
        if (options.message) {
            renderInput(options.message)
        } else {
            // First parameter is the file to read and parse
            const filename = path.join(process.cwd(), program.args[0])
            renderInput(fs.readFileSync(filename, 'utf8')) //eslint-disable-line no-sync
        }
    } catch (e) {
        console.error(e) //eslint-disable-line no-console
        process.exit(1) //eslint-disable-line no-process-exit
    }
} else {
    // Read input stream

    let streamData = ''

    process.stdin.resume()
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (chunk) => {
        if (chunk === '\n') {
            renderInput(streamData)
            streamData = ''
            return
        }
        streamData += chunk
    })
    process.stdin.on('end', () => {
        renderInput(streamData)
    })
}