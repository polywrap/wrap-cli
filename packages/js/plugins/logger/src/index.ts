import { query } from "./resolvers";
import { manifest, Logger_LogLevel } from "./w3";

import {
  Plugin,
  PluginPackageManifest,
  PluginModules,
  PluginPackage,
} from "@web3api/core-js";

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

  public getModules(): PluginModules {
    return {
      query: query(this),
    };
  }

  public log(level: Logger_LogLevel, message: string): boolean {
    if (this._logFunc) {
      return this._logFunc(level, message);
    }

    switch (level) {
      case Logger_LogLevel.DEBUG:
        console.debug(message);
        break;
      case Logger_LogLevel.WARN:
        console.warn(message);
        break;
      case Logger_LogLevel.ERROR:
        console.error(message);
        break;
      case Logger_LogLevel.INFO:
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
