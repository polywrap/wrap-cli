import {
  Module,
  Args_log,
  Logger_LogLevel,
  Logger_LogLevelEnum,
  manifest,
} from "./wrap";

import { PluginFactory, PluginPackage } from "@polywrap/plugin-js";

export type LogFunc = (level: Logger_LogLevel, message: string) => boolean;

export interface LoggerPluginConfig {
  logFunc?: LogFunc;
}

export class LoggerPlugin extends Module<LoggerPluginConfig> {
  public log(args: Args_log): boolean {
    if (this.config.logFunc) {
      return this.config.logFunc(args.level, args.message);
    }

    switch (args.level) {
      case "DEBUG":
      case Logger_LogLevelEnum.DEBUG:
        console.debug(args.message);
        break;
      case "WARN":
      case Logger_LogLevelEnum.WARN:
        console.warn(args.message);
        break;
      case "ERROR":
      case Logger_LogLevelEnum.ERROR:
        console.error(args.message);
        break;
      case "INFO":
      case Logger_LogLevelEnum.INFO:
        console.log(args.message);
        break;
      default:
        console.log(args.message);
    }

    return true;
  }
}

export const loggerPlugin: PluginFactory<LoggerPluginConfig> = (
  config: LoggerPluginConfig
) => new PluginPackage(manifest, new LoggerPlugin(config));

export const plugin = loggerPlugin;
