import {
  Module,
  Input_log,
  Logger_LogLevel,
  Logger_LogLevelEnum,
} from "./w3";

export type LogFunc = (level: Logger_LogLevel, message: string) => boolean;

export interface QueryConfig extends Record<string, unknown> {
  logFunc?: LogFunc;
}

export class Query extends Module<QueryConfig> {
  public log(input: Input_log): boolean {
    if (this.config.logFunc) {
      return this.config.logFunc(input.level, input.message);
    }

    switch (input.level) {
      case "DEBUG":
      case Logger_LogLevelEnum.DEBUG:
        console.debug(input.message);
        break;
      case "WARN":
      case Logger_LogLevelEnum.WARN:
        console.warn(input.message);
        break;
      case "ERROR":
      case Logger_LogLevelEnum.ERROR:
        console.error(input.message);
        break;
      case "INFO":
      case Logger_LogLevelEnum.INFO:
        console.log(input.message);
        break;
      default:
        console.log(input.message);
    }

    return true;
  }
}
