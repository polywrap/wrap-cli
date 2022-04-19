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

export interface Sha3PluginConfigs {
  query: QueryConfig;
}

export class Sha3Plugin implements Plugin {
  constructor(private _configs: Sha3PluginConfigs) {}

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: new Query(this._configs.query),
    };
  }
}

export const sha3Plugin: PluginFactory<Sha3PluginConfigs> = (
  opts: Sha3PluginConfigs
) => {
  return {
    factory: () => new Sha3Plugin(opts),
    manifest: manifest,
  };
};

export const plugin = sha3Plugin;
