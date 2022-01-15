import { intlMsg } from "../intl";

import { BindLanguage } from "@web3api/schema-bind";

export const manifestLanguages = {
  "wasm/assemblyscript": "wasm/assemblyscript",
  "plugin/typescript": "plugin/typescript",
  "dapp/typescript": "dapp/typescript",
  interface: "interface",
};

export type ManifestLanguages = typeof manifestLanguages;

export type ManifestLanguage = keyof ManifestLanguages;

export function isManifestLanguage(
  language: string
): language is ManifestLanguage {
  return language in manifestLanguages;
}

export function manifestLanguageToBindLanguage(
  manifestLanguage: ManifestLanguage
): BindLanguage {
  switch (manifestLanguage) {
    case "wasm/assemblyscript":
      return "wasm-as";
    case "plugin/typescript":
    case "dapp/typescript":
      return "plugin-ts";
    case "interface":
      throw Error(intlMsg.lib_language_noInterfaceCodegen());
    default:
      throw Error(
        intlMsg.lib_language_unsupportedManifestLanguage({
          language: manifestLanguage,
        })
      );
  }
}
