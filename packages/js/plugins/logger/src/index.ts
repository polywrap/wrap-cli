import { query } from "./resolvers";
import { manifest } from "./manifest";

import colors from "colors";
import { Plugin, PluginManifest, PluginModules } from "@web3api/core-js";

export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export class LoggerPlugin extends Plugin {
  constructor() {
    super();
  }

  public static manifest(): PluginManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: query(this),
    };
  }

  public async log(level: LogLevel, message: string): Promise<boolean> {
    switch (level) {
      case LogLevel.DEBUG:
        console.log(colors.blue(message));
        break;
      case LogLevel.WARN:
        console.log(colors.yellow(message));
        break;
      case LogLevel.ERROR:
        console.log(colors.red(message));
        break;
      default:
        console.log(message);
    }

    return true;
  }
}
