import {
  Module,
  Input_log,
  Logger_LogLevel,
  Logger_LogLevelEnum,
  manifest,
} from "./polywrap-man";

import { PluginFactory } from "@polywrap/core-js";

export type LogFunc = (level: Logger_LogLevel, message: string) => boolean;

export interface LoggerPluginConfig extends Record<string, unknown> {
  logFunc?: LogFunc;
}

export class LoggerPlugin extends Module<LoggerPluginConfig> {
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

export const loggerPlugin: PluginFactory<LoggerPluginConfig> = (
  opts: LoggerPluginConfig
) => {
  return {
    factory: () => new LoggerPlugin(opts),
    manifest,
  };
};

export const plugin = loggerPlugin;
