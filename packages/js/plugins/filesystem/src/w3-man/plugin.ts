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

export interface FilesystemPluginConfigs {
  query: QueryConfig;
}

export class FilesystemPlugin implements Plugin {
  constructor(private _configs: FilesystemPluginConfigs) { }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: new Query(this._configs.query),
    };
  }
}

export const filesystemPlugin: PluginFactory<FilesystemPluginConfigs> = (
  opts: FilesystemPluginConfigs
) => {
  return {
    factory: () => new FilesystemPlugin(opts),
    manifest: manifest,
  };
};

export const plugin = filesystemPlugin;
