/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import { Query, QueryConfig } from "../query";
import { manifest } from "./manifest";

import {
  Plugin,
  PluginFactory,
  PluginPackageManifest,
  PluginModules,
} from "@web3api/core-js";

export interface HttpPluginConfigs {
  query: QueryConfig;
}

export class HttpPlugin implements Plugin {
  constructor(private _configs: HttpPluginConfigs) {}

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: new Query(this._configs.query),
    };
  }
}

export const httpPlugin: PluginFactory<HttpPluginConfigs> = (
  opts: HttpPluginConfigs
) => {
  return {
    factory: () => new HttpPlugin(opts),
    manifest: manifest,
  };
};

export const plugin = httpPlugin;
