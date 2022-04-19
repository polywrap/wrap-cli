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

export interface IpfsPluginConfigs {
  query: QueryConfig;
  mutation: MutationConfig;
}

export class IpfsPlugin implements Plugin {
  constructor(private _configs: IpfsPluginConfigs) {}

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

export const ipfsPlugin: PluginFactory<IpfsPluginConfigs> = (
  opts: IpfsPluginConfigs
) => {
  return {
    factory: () => new IpfsPlugin(opts),
    manifest: manifest,
  };
};

export const plugin = ipfsPlugin;
