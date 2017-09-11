// @flow

const fs = require('fs');

export type Logger = {
  warn(...args: any): void,
  error(...args: any): void,
  info(...args: any): void,
  log(...args: any): void,
  debug(...args: any): void,
};

/* eslint-disable no-console */

export class ConsoleLogger {
  prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  warn(...args: any) {
    console.warn(...this.format(args));
  }

  error(...args: any) {
    console.error(...this.format(args));
  }

  info(...args: any) {
    console.info(...this.format(args));
  }

  debug(...args: any) {
    console.debug(...this.format(args));
  }

  log(...args: any) {
    console.log(...this.format(args));
  }

  format(args_: any): any {
    const args = args_.filter(a => a != null);
    if (typeof args[0] === 'string') {
      if (args.length === 1) {
        return [`${this.prefix} ${args[0]}`];
      } else if (args.length === 2) {
        return [`${this.prefix} ${args[0]}`, args[1]];
      } else {
        return [`${this.prefix} ${args[0]}`, args.slice(1)];
      }
    }

    return [`${this.prefix}`, args];
  }
}

export class FileLogger {
  fileDescriptor: number;

  close() {
    if (this.fileDescriptor) {
      fs.close(this.fileDescriptor);
      this.fileDescriptor = null;
    }
  }

  open(filePath: string) {
    this.close();
    this.fileDescriptor = fs.openSync(filePath, 'a');
  }

  warn(...args: any): void {
    this.write('WARN', args);
  }

  error(...args: any): void {
    this.write('ERROR', args);
  }

  info(...args: any): void {
    this.write('INFO', args);
  }

  log(...args: any): void {
    this.write('LOG', args);
  }

  debug(...args: any): void {
    this.write('DEBUG', args);
  }

  write(level: string, args: any): void {
    if (this.fileDescriptor) {
      const formatted = `\n${level} ${JSON.stringify(args)}`;
      fs.writeSync(this.fileDescriptor, formatted);
    }
  }
}

export class CompositeLogger {
  loggers: Logger[] = [];

  addLogger(logger: Logger): void {
    this.loggers.push(logger);
  }

  warn(...args: any): void {
    for (const logger of this.loggers) {
      logger.warn(...args);
    }
  }

  error(...args: any): void {
    for (const logger of this.loggers) {
      logger.error(...args);
    }
  }

  info(...args: any): void {
    for (const logger of this.loggers) {
      logger.info(...args);
    }
  }

  log(...args: any): void {
    for (const logger of this.loggers) {
      logger.log(...args);
    }
  }

  debug(...args: any): void {
    for (const logger of this.loggers) {
      logger.debug(...args);
    }
  }
}

export class NullLogger {
  warn(...args: any): void {}
  error(...args: any): void {}
  info(...args: any): void {}
  log(...args: any): void {}
  debug(...args: any): void {}
}
