/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import {
  Plugin,
  PluginFactory,
  PluginPackageManifest,
  PluginModules
} from "@web3api/core-js";
import { Query, QueryConfig } from "../query";
import { manifest } from "./manifest";

export interface LoggerPluginConfigs {
  query: QueryConfig;
}

export class LoggerPlugin implements Plugin {
  constructor(private _configs: LoggerPluginConfigs) { }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: new Query(this._configs.query),
    };
  }
}

export const loggerPlugin: PluginFactory<LoggerPluginConfigs> = (
  opts: LoggerPluginConfigs
) => {
  return {
    factory: () => new LoggerPlugin(opts),
    manifest: manifest,
  };
};

export const plugin = loggerPlugin;
