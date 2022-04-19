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

export interface EnsPluginConfigs {
  query: QueryConfig;
}

export class EnsPlugin implements Plugin {
  constructor(private _configs: EnsPluginConfigs) {}

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: new Query(this._configs.query),
    };
  }
}

export const ensPlugin: PluginFactory<EnsPluginConfigs> = (
  opts: EnsPluginConfigs
) => {
  return {
    factory: () => new EnsPlugin(opts),
    manifest: manifest,
  };
};

export const plugin = ensPlugin;
