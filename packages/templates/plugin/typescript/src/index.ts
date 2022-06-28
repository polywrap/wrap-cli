import { Module, Args_sampleMethod, manifest } from "./wrap";

import { PluginFactory } from "@polywrap/core-js";

export interface SamplePluginConfig {
  defaultValue: string;
}

export class SamplePlugin extends Module<SamplePluginConfig> {
  constructor(config: SamplePluginConfig) {
    super(config);
  }
  public sampleMethod(args: Args_sampleMethod): string {
    return args.data + this.config.defaultValue;
  }
}

export const samplePlugin: PluginFactory<SamplePluginConfig> = (
  config: SamplePluginConfig
) => {
  return {
    factory: () => new SamplePlugin(config),
    manifest,
  };
};

export const plugin = samplePlugin;
