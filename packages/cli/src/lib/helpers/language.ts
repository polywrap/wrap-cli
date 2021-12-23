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
    case "dapp/typescript":
      return "plugin-ts"; // TODO: should TargetLanguage be expanded to include "dapp-ts"?
    default:
      throw Error(
        intlMsg.lib_language_unsupportedManifestLanguage({
          language: manifestLanguage,
        })
      );
  }
}
