import { manifest } from "./manifest";
import { query } from "./resolvers";

import {
  Plugin,
  PluginPackageManifest,
  PluginModules,
  PluginPackage,
} from "@web3api/core-js";

export class UTS46Plugin extends Plugin {
  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  getModules(): PluginModules {
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
