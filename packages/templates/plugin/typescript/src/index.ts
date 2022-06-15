import { Module, Input_sampleMethod, manifest } from "./w3";

import { PluginFactory } from "@polywrap/core-js";

export interface SamplePluginConfig extends Record<string, unknown> {
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
  opts: SamplePluginConfig
) => {
  return {
    factory: () => new SamplePlugin(opts),
    manifest,
  };
};

export const plugin = samplePlugin;
