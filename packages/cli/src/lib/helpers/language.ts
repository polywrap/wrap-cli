import { intlMsg } from "../intl";

import { TargetLanguage } from "@web3api/schema-bind";

export function manifestLanguageToTargetLanguage(
  manifestLanguage: string
): TargetLanguage {
  switch (manifestLanguage) {
    case "wasm/assemblyscript":
      return "wasm-as";
    case "plugin/typescript":
      return "plugin-ts";
    default:
      throw Error(
        intlMsg.lib_language_unsupportedManifestLanguage({
          language: manifestLanguage,
        })
      );
  }
}
