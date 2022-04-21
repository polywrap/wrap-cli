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

export interface GraphNodePluginConfigs {
  query: QueryConfig;
}

export class GraphNodePlugin implements Plugin {
  constructor(private _configs: GraphNodePluginConfigs) {}

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: new Query(this._configs.query),
    };
  }
}

export const graphNodePlugin: PluginFactory<GraphNodePluginConfigs> = (
  opts: GraphNodePluginConfigs
) => {
  return {
    factory: () => new GraphNodePlugin(opts),
    manifest: manifest,
  };
};

export const plugin = graphNodePlugin;
