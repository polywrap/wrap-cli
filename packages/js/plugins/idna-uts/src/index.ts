import { manifest } from "../../ethereum/src/manifest";
import { query } from "./resolvers";

import { Plugin, PluginManifest, PluginModules } from "@web3api/core-js";

export class UTS46Plugin extends Plugin {
  public static manifest(): PluginManifest {
    return manifest;
  }

  getModules(): PluginModules {
    return {
      query: query(),
    };
  }
}
