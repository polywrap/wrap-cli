import { mutation, query } from "./resolvers";
import { manifest } from "./w3";

import {
  Plugin,
  PluginFactory,
  PluginPackageManifest,
  PluginModules,
} from "@web3api/core-js";

export interface SamplePluginConfig {
  defaultValue: string;
}

export class SamplePlugin extends Plugin {
  constructor(private _config: SamplePluginConfig) {
    super();
  }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: query(this),
      mutation: mutation(this),
    };
  }

  public async sampleQuery(data: string): Promise<string> {
    return data + this._config.defaultValue;
  }

  public sampleMutation(data: Uint8Array): boolean {
    return data.length > 0;
  }
}

export const samplePlugin: PluginFactory<SamplePluginConfig> = (
  opts: SamplePluginConfig
) => {
  return {
    factory: () => new SamplePlugin(opts),
    manifest: SamplePlugin.manifest(),
  };
};

export const plugin = samplePlugin;
