import { Log, LogLevel } from "../Log";

import chalk from "chalk";

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
        console.debug(chalk.gray(message));
        break;
      case LogLevel.INFO:
        console.info(message);
        break;
      case LogLevel.WARN:
        console.warn(chalk.yellow(message));
        break;
      case LogLevel.ERROR:
        console.error(chalk.red(message));
        break;
    }
  }
}
