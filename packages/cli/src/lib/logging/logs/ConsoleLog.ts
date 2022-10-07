import { Log, LogLevel } from "../Log";

export class ConsoleLog extends Log {
  constructor(level: LogLevel) {
    super(level);
  }

  public log(message: string, level: LogLevel): void {
    if (level < this.level) {
      return;
    }

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(message);
        break;
      case LogLevel.INFO:
        console.info(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.ERROR:
        console.error(message);
        break;
    }
  }
}
