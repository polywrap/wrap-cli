import { Module, Input_sampleMethod, manifest } from "./wrap";

import { PluginFactory } from "@polywrap/core-js";

export interface SamplePluginConfig {
  defaultValue: string;
}

export class SamplePlugin extends Module<SamplePluginConfig> {
  constructor(config: SamplePluginConfig) {
    super(config);
  }
  public sampleMethod(input: Input_sampleMethod): string {
    return input.data + this.config.defaultValue;
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
