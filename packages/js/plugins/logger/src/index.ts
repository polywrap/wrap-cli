import { query } from "./resolvers";
import {
  manifest,
  Query,
  Logger_LogLevel,
  Logger_LogLevelEnum,
} from "./w3";

import { Plugin, PluginPackageManifest, PluginPackage } from "@web3api/core-js";

export type LogFunc = (level: Logger_LogLevel, message: string) => boolean;

export class LoggerPlugin extends Plugin {
  private _logFunc?: LogFunc;

  constructor(logFunc?: LogFunc) {
    super();
    this._logFunc = logFunc;
  }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): {
    query: Query.Module;
  } {
    return {
      query: query(this),
    };
  }

  public log(level: Logger_LogLevel, message: string): boolean {
    if (this._logFunc) {
      return this._logFunc(level, message);
    }

    switch (level) {
      case "DEBUG":
      case Logger_LogLevelEnum.DEBUG:
        console.debug(message);
        break;
      case "WARN":
      case Logger_LogLevelEnum.WARN:
        console.warn(message);
        break;
      case "ERROR":
      case Logger_LogLevelEnum.ERROR:
        console.error(message);
        break;
      case "INFO":
      case Logger_LogLevelEnum.INFO:
        console.log(message);
        break;
      default:
        console.log(message);
    }

    return true;
  }
}

export const loggerPlugin = (): PluginPackage => {
  return {
    factory: () => new LoggerPlugin(),
    manifest: manifest,
  };
};
export const plugin = loggerPlugin;
