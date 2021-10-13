import { query } from "./resolvers";
import { manifest, Query } from "./w3";

import { Plugin, PluginPackage, PluginPackageManifest } from "@web3api/core-js";

export class FilesystemPlugin extends Plugin {
  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): { query: Query.Module } {
    return {
      query: query(),
    };
  }
}

export const filesystemPlugin = (): PluginPackage => {
  return {
    factory: () => new FilesystemPlugin(),
    manifest: manifest,
  };
};
export const plugin = filesystemPlugin;
