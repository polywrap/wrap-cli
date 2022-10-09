export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export abstract class Log {
  public readonly level: LogLevel;

  constructor(level: LogLevel) {
    this.level = level;
  }

  public abstract log(message: string, level: LogLevel): void;
}
