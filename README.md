# FormattedLogger: A Simple and Colorful Logging Library

FormattedLogger is a TypeScript-based logging library designed to provide formatted and color-coded log messages. This library makes it easy to produce readable and structured log output for various logging levels, including error, warn, info, debug, and log.

## Features

- Color-coded log messages for easy differentiation.
- Support for multiple log levels.
- Grouped logging for better log organization.
- Error handling with stack traces.
- Customizable log levels to control what gets logged.

## Installation

To use FormattedLogger, you need to have ansis installed. You can install it via npm:

`ansis
npm install ansis
`

## Usage

### Importing the Library

To use the FormattedLogger, import it into your TypeScript or JavaScript file:

`typescript
import FormattedLogger from './FormattedLogger'
`

### Basic Logging

FormattedLogger provides methods for logging messages at different levels. Here are some examples:

```typescript
FormattedLogger.error(new Error('This is an error'), "Additional error message")
FormattedLogger.warn("This is a warning")
FormattedLogger.info("This is an info message")
FormattedLogger.debug({ key: "value" }, "Debugging information")
FormattedLogger.log("A general log message")
```

### Grouping Logs

You can group multiple log messages together to create a structured output:

```typescript
FormattedLogger.group('info')
FormattedLogger.info("Grouped info message 1")
FormattedLogger.info("Grouped info message 2")
FormattedLogger.ungroup()
```

### Setting Log Levels

You can customize which log levels should be active. By default, all levels are active:

```typescript
FormattedLogger.setLevel(['error', 'warn', 'info'])
```

### Example

Here is a complete example demonstrating various features of the FormattedLogger:

```typescript
import FormattedLogger from './FormattedLogger'

// Setting log levels
FormattedLogger.setLevel(['debug', 'error', 'warn'])

// Grouped logging
FormattedLogger.group('debug')
FormattedLogger.debug("Grouped debug message 1", { detail: "some detail" })
FormattedLogger.debug("Grouped debug message 2")
FormattedLogger.ungroup()

// Logging at different levels
FormattedLogger.error(new Error('An error occurred'))
FormattedLogger.warn("This is a warning")
FormattedLogger.info("This is an information message")
FormattedLogger.debug({ key: "value" }, "Debugging data")
FormattedLogger.log("A general log message")
```
### Console Output

Here are some examples of the console output you can expect:

**Error Log:**

![Error Log](images/error-log.png)

**Grouped Logs:**

![Grouped Logs](images/grouped-logs.png)

**Info Log:**

![Info Log](images/info-log.png)

## API Reference

### Methods

#### `group(level: LoggerLevel)`

Starts a new log group. All subsequent log messages will be part of this group until `ungroup()` is called.

- `level`: The logging level of the group.

#### `ungroup()`

Ends the current log group.

#### `debug(...messages: any[])`

Logs a debug message.

- `messages`: One or more messages to log.

#### `info(...messages: any[])`

Logs an info message.

- `messages`: One or more messages to log.

#### `warn(...messages: any[])`

Logs a warning message.

- `messages`: One or more messages to log.

#### `error(...messages: any[])`

Logs an error message.

- `messages`: One or more messages to log.

#### `log(...messages: any[])`

Logs a general message.

- `messages`: One or more messages to log.

#### `setLevel(levels: LoggerLevel[])`

Sets the active log levels. Only messages at these levels will be logged.

- `levels`: An array of log levels to be active.

## Conclusion

FormattedLogger is a simple yet beautiful logging library that helps you produce well-formatted and readable logs. By using color-coding and grouping, and timestamps, it enhances the visibility and organization of your log messages, making debugging and monitoring easier.

Feel free to contribute or suggest improvements!
