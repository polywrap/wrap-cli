import { manifest } from "./../../ethereum/src/manifest";
import { query } from "./resolvers";

import { Plugin, PluginManifest, PluginModules } from "@web3api/core-js";
import ensNamehash from "eth-ens-namehash";

export class EnsNamehashPlugin extends Plugin {
  public static manifest(): PluginManifest {
    return manifest;
  }

  getModules(): PluginModules {
    return {
      query: query(this),
    };
  }

  namehash(value: string): string {
    return ensNamehash.hash(value);
  }

  normalize(value: string): string {
    return ensNamehash.normalize(value);
  }
}
