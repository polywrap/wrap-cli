import { mutation, query } from "./resolvers";
import { manifest } from "./manifest";

import { Plugin, PluginManifest, PluginModules } from "@web3api/core-js";

export interface SamplePluginConfig {
  defaultValue: string;
}

export class SamplePlugin extends Plugin {
  constructor(private _config: SamplePluginConfig) {
    super();
  }

  public static manifest(): PluginManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: query(this),
      mutation: mutation(this),
    };
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  public async sampleQuery(query: string): Promise<string> {
    // Todo: Add query processing part here
    return this._config.defaultValue;
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  public async sampleMutation(data: Uint8Array): Promise<string> {
    // Todo: Add mutation processing part here
    return this._config.defaultValue;
  }
}
