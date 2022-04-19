/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import { Query, QueryConfig } from "../query";
import { Mutation, MutationConfig } from "../mutation";
import { manifest } from "./manifest";

import {
  Plugin,
  PluginFactory,
  PluginPackageManifest,
  PluginModules,
} from "@web3api/core-js";

export interface EthereumPluginConfigs {
  query: QueryConfig;
  mutation: MutationConfig;
}

export class EthereumPlugin implements Plugin {
  constructor(private _configs: EthereumPluginConfigs) {}

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: new Query(this._configs.query),
      mutation: new Mutation(this._configs.mutation),
    };
  }
}

export const ethereumPlugin: PluginFactory<EthereumPluginConfigs> = (
  opts: EthereumPluginConfigs
) => {
  return {
    factory: () => new EthereumPlugin(opts),
    manifest: manifest,
  };
};

export const plugin = ethereumPlugin;
