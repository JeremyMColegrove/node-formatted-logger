import FormattedLogger from '../logger';

describe('FormattedLogger', () => {
  let logger: FormattedLogger;
  let output: string;

  beforeEach(() => {
    output = '';
    logger = new FormattedLogger({
      pipe: (...args: any[]) => {
        console.log(...args)
        output += args.join(' ') + '\n';
      },
      noColor: true,  // Disable colors for easier testing
      autoGroup: true,
    });
  });

  it('should log a message at the log level', () => {
    logger.log('This is a log message');
    expect(output).toContain('[LOG]');
    expect(output).toContain('This is a log message');
  });

  it('should log a message at the info level', () => {
    logger.info('This is an info message');
    expect(output).toContain('[INFO]');
    expect(output).toContain('This is an info message');
  });

  it('should log a message at the warn level', () => {
    logger.warn('This is a warning');
    expect(output).toContain('[WARN]');
    expect(output).toContain('This is a warning');
  });

  it('should log a message at the debug level', () => {
    logger.debug('Debugging message');
    expect(output).toContain('[DEBUG]');
    expect(output).toContain('Debugging message');
  });

  it('should log a message at the error level', () => {
    logger.error('An error occurred');
    expect(output).toContain('[ERROR]');
    expect(output).toContain('An error occurred');
  });

  it('should group log messages when autoGroup is enabled', () => {
    logger.log('First message', 'Second message');
    expect(output).toContain('Log Group 0');
    expect(output).toContain('[LOG]');
    expect(output).toContain('First message');
    expect(output).toContain('Second message');
    expect(output).toContain('Log Group 0 END');
  });

  it('should manually group and ungroup messages', () => {
    logger.group('Custom Group');
    logger.log('Grouped message');
    logger.ungroup();
    expect(output).toContain('Log Group 0: Custom Group');
    expect(output).toContain('Grouped message');
    expect(output).toContain('Log Group 0 END');
  });

  it('should indent messages correctly within a group', () => {
    logger.group('First Group');
    logger.log('First message in group');
    logger.group('Nested Group');
    logger.log('Nested message');
    logger.ungroup();
    logger.log('Back to first group');
    logger.ungroup();
    logger.log('Outside group');

    const lines = output.split('\n').filter(line => line.trim() !== '');
    expect(lines[1]).toContain('First message in group');
    expect(lines[2]).toContain('   Log Group 0: Nested Group'); // Indented by 3 spaces
    expect(lines[4]).toContain(`Log Group 0 END`);
    expect(lines[5]).toContain('Back to first group');
    expect(lines[7]).toContain('Outside group');
  });

  it('should strip colors from messages when stripColors is called', () => {
    const coloredMessage = logger.info('Colored info message');
    const strippedMessage = FormattedLogger.stripColors(output)[0];

    expect(strippedMessage).toContain('Colored info message');
    expect(strippedMessage).not.toContain('\x1b'); // No escape sequences for colors
  });

  it('should correctly apply custom date transformer', () => {
    const customLogger = new FormattedLogger({
      pipe: (...args: any[]) => {
        output += args.join(' ') + '\n';
      },
      dateTransformer: (date:Date) => date.toISOString(),
    });

    customLogger.info('Testing date');
    expect(output).toContain(new Date().toISOString().split('T')[0]);
  });

  it('should respect logLevels configuration', () => {
    const customLogger = new FormattedLogger({
      pipe: (...args: any[]) => {
        output += args.join(' ') + '\n';
      },
      logLevels: ['error', 'warn'],
    });

    customLogger.log('This should not appear');
    customLogger.info('Neither should this');
    customLogger.warn('But this should');
    customLogger.error('And this too');

    expect(output).toContain('[WARN]');
    expect(output).toContain('[ERROR]');
    expect(output).not.toContain('[LOG]');
    expect(output).not.toContain('[INFO]');
  });
});