import { manifest } from "./manifest";
import { query } from "./resolvers";

import {
  Plugin,
  PluginManifest,
  PluginModules,
  PluginPackage,
} from "@web3api/core-js";

export class SHA3Plugin extends Plugin {
  public static manifest(): PluginManifest {
    return manifest;
  }

  getModules(): PluginModules {
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
