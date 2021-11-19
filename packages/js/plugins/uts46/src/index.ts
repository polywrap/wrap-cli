import { manifest, Query } from "./w3";
import { query } from "./resolvers";

import { Plugin, PluginPackageManifest, PluginPackage } from "@web3api/core-js";

export class UTS46Plugin extends Plugin {
  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  getModules(): {
    query: Query.Module;
  } {
    return {
      query: query(),
    };
  }
}

export const uts46Plugin = (): PluginPackage => {
  return {
    factory: () => new UTS46Plugin(),
    manifest: manifest,
  };
};
export const plugin = uts46Plugin;
