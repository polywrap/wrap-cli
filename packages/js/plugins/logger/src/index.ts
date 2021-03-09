import { query } from "./resolvers";
import { manifest } from "./manifest";

import { Plugin, PluginManifest, PluginModules } from "@web3api/core-js";

export class LoggerPlugin extends Plugin {
  constructor() {
    super();
  }

  public static manifest(): PluginManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: query(this),
    };
  }

  public async log(level: string, message: string): Promise<void> {
    console.info(message);
  }
}
