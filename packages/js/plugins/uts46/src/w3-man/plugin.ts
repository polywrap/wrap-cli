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

export interface Uts46PluginConfigs {
  query: QueryConfig;
}

export class Uts46Plugin implements Plugin {
  constructor(private _configs: Uts46PluginConfigs) { }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: new Query(this._configs.query),
    };
  }
}

export const uts46Plugin: PluginFactory<Uts46PluginConfigs> = (
  opts: Uts46PluginConfigs
) => {
  return {
    factory: () => new Uts46Plugin(opts),
    manifest: manifest,
  };
};

export const plugin = uts46Plugin;
