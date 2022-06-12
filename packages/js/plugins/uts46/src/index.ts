/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  Module,
  Input_toAscii,
  Input_toUnicode,
  Input_convert,
  ConvertResult,
} from "./w3-man";

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const uts46 = require("idna-uts46-hx/uts46bundle.js");

export interface Config extends Record<string, unknown> {}

export class Uts46 extends Module<Config> {
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
