export enum LogLevel {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}

export interface ILogger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export class DefaultLogger implements ILogger {
  public debug(message: string): void {
    console.debug(message);
  }

  public info(message: string): void {
    console.log(message);
  }

  public warn(message: string): void {
    console.warn(message);
  }

  public error(message: string): void {
    console.error(message);
  }
}
