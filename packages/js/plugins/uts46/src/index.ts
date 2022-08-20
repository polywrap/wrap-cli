import {
  Module,
  Args_toAscii,
  Args_toUnicode,
  Args_convert,
  ConvertResult,
  manifest,
} from "./wrap-man";

import { PluginFactory } from "@polywrap/core-js";

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const uts46 = require("idna-uts46-hx/uts46bundle.js");

type NoConfig = Record<string, never>;

export class Uts46Plugin extends Module<NoConfig> {
  public toAscii(args: Args_toAscii): string {
    return uts46.toAscii(args.value);
  }

  public toUnicode(args: Args_toUnicode): string {
    return uts46.toUnicode(args.value);
  }

  public convert(args: Args_convert): ConvertResult {
    return uts46.convert(args.value);
  }
}

export const uts46Plugin: PluginFactory<NoConfig> = () => {
  return {
    factory: () => new Uts46Plugin({}),
    manifest,
  };
};

export const plugin = uts46Plugin;
