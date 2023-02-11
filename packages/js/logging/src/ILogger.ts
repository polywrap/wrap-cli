import { LogLevel } from "./LogLevel";

export interface ILogger {
  log(message: string, level: LogLevel): void;
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}
