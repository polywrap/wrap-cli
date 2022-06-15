/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  Module,
  Input_toAscii,
  Input_toUnicode,
  Input_convert,
  ConvertResult,
  manifest,
} from "./polywrap-man";

import { PluginFactory } from "@polywrap/core-js";

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const uts46 = require("idna-uts46-hx/uts46bundle.js");

export interface Uts46PluginConfig extends Record<string, unknown> {}

export class Uts46Plugin extends Module<Uts46PluginConfig> {
  public toAscii(input: Input_toAscii): string {
    return uts46.toAscii(input.value);
  }

  public toUnicode(input: Input_toUnicode): string {
    return uts46.toUnicode(input.value);
  }

  public convert(input: Input_convert): ConvertResult {
    return uts46.convert(input.value);
  }
}

export const uts46Plugin: PluginFactory<Uts46PluginConfig> = (
  opts: Uts46PluginConfig
) => {
  return {
    factory: () => new Uts46Plugin(opts),
    manifest,
  };
};

export const plugin = uts46Plugin;
