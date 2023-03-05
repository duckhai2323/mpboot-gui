export interface Logger {
  log(message: string, context?: any): void;
  error(message: string, err?: Error): void;
  warn(message: string, context?: any): void;
  debug(message: string, context?: any): void;
}
export class ConsoleLogger implements Logger {
  private boundary = '-------------------------------------';

  debug(message: string, context?: any): void {
    console.debug(this.boundary);
    if (context) {
      console.debug(message, { context });
    } else {
      console.debug(message);
    }
    console.debug(this.boundary);
  }

  log(message: string, context?: any): void {
    console.log(this.boundary);
    if (context) {
      console.log(message, { context });
    } else {
      console.log(message);
    }
    console.log(this.boundary);
  }
  error(message: string, err?: Error): void {
    console.error(this.boundary);
    if (err) {
      console.error(message, { err });
    } else {
      console.error(message);
    }
    console.error(this.boundary);
  }
  warn(message: string, context?: any): void {
    console.warn(this.boundary);
    if (context) {
      console.warn(message, { context });
    } else {
      console.warn(message);
    }
    console.warn(this.boundary);
  }
}

export const logger: Logger = new ConsoleLogger();
