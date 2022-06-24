import {
  Module,
  Input_toAscii,
  Input_toUnicode,
  Input_convert,
  ConvertResult,
  manifest,
} from "./wrap";

import { PluginFactory } from "@polywrap/core-js";

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const uts46 = require("idna-uts46-hx/uts46bundle.js");

type NoConfig = Record<string, never>;

export class Uts46Plugin extends Module<NoConfig> {
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

export const uts46Plugin: PluginFactory<NoConfig> = () => {
  return {
    factory: () => new Uts46Plugin({}),
    manifest,
  };
};

export const plugin = uts46Plugin;
