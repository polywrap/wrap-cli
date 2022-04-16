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

export interface HttpPluginConfigs {
  query: QueryConfig;
}

export class HttpPlugin implements Plugin {
  constructor(private _configs: HttpPluginConfigs) { }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: new Query(this._configs.query),
    };
  }
}

export const httpNodePlugin: PluginFactory<HttpPluginConfigs> = (
  opts: HttpPluginConfigs
) => {
  return {
    factory: () => new HttpPlugin(opts),
    manifest: manifest,
  };
};

export const plugin = httpNodePlugin;
