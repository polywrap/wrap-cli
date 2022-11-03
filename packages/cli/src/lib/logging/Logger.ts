import { Log } from "./Log";

import { ILogger, LogLevel } from "@polywrap/logging-js";

export interface Logs {
  [name: string]: Log;
}

export class Logger implements ILogger {
  private _logs: Logs;

  constructor(logs: Logs) {
    this._logs = logs;
  }

  public getLog(name: string): Log | undefined {
    return this._logs[name];
  }

  public setLog(name: string, log: Log): void {
    this._logs[name] = log;
  }

  public removeLog(name: string): void {
    delete this._logs[name];
  }

  public log(message: string, level: LogLevel): void {
    Object.values(this._logs).forEach((log) => log.log(message, level));
  }

  public debug(message: string): void {
    this.log(message, LogLevel.DEBUG);
  }

  public info(message: string): void {
    this.log(message, LogLevel.INFO);
  }

  public warn(message: string): void {
    this.log(message, LogLevel.WARN);
  }

  public error(message: string): void {
    this.log(message, LogLevel.ERROR);
  }
}
