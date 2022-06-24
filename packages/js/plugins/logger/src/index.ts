import {
  Module,
  Input_log,
  Logger_LogLevel,
  Logger_LogLevelEnum,
  manifest,
} from "./wrap";

import { PluginFactory } from "@polywrap/core-js";

export type LogFunc = (level: Logger_LogLevel, message: string) => boolean;

export interface LoggerPluginConfig {
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
  config: LoggerPluginConfig
) => {
  return {
    factory: () => new LoggerPlugin(config),
    manifest,
  };
};

export const plugin = loggerPlugin;
