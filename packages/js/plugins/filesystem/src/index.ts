/* eslint-disable import/no-extraneous-dependencies */
import { query } from "./resolvers";
import { manifest, Query } from "./w3";

import { Plugin, PluginPackageManifest, PluginFactory } from "@web3api/core-js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FilesystemConfig {}

export class FilesystemPlugin extends Plugin {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  constructor(private _config: FilesystemConfig) {
    super();
  }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): { query: Query.Module } {
    return {
      query: query(this),
    };
  }
}

export const filesystemPlugin: PluginFactory<FilesystemConfig> = (
  opts: FilesystemConfig
) => {
  return {
    factory: () => new FilesystemPlugin(opts),
    manifest: manifest,
  };
};
export const plugin = filesystemPlugin;
