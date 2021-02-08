export enum LogLevel {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}

export interface ILogger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

export class DefaultLogger implements ILogger {
  public debug(message: string, ...args: unknown[]): void {
    console.debug(message, args);
  }

  public info(message: string, ...args: unknown[]): void {
    console.log(message, args);
  }

  public warn(message: string, ...args: unknown[]): void {
    console.warn(message, args);
  }

  public error(message: string, ...args: unknown[]): void {
    console.error(message, args);
  }
}
