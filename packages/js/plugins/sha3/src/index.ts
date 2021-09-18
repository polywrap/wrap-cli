import { manifest, Query } from "./w3";
import { query } from "./resolvers";

import { Plugin, PluginPackageManifest, PluginPackage } from "@web3api/core-js";

export class SHA3Plugin extends Plugin {
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

export const sha3Plugin = (): PluginPackage => {
  return {
    factory: () => new SHA3Plugin(),
    manifest: manifest,
  };
};
export const plugin = sha3Plugin;
