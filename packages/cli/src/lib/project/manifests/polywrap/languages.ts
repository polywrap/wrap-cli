import { intlMsg } from "../../../intl";

import { BindLanguage } from "@polywrap/schema-bind";

export const polywrapManifestLanguages = {
  "wasm/assemblyscript": "wasm/assemblyscript",
  "wasm/rust": "wasm/rust",
  interface: "interface",
};

export type PolywrapManifestLanguages = typeof polywrapManifestLanguages;

export type PolywrapManifestLanguage = keyof PolywrapManifestLanguages;

export function isPolywrapManifestLanguage(
  language: string
): language is PolywrapManifestLanguage {
  return language in polywrapManifestLanguages;
}

export function polywrapManifestLanguageToBindLanguage(
  manifestLanguage: PolywrapManifestLanguage
): BindLanguage {
  switch (manifestLanguage) {
    case "wasm/assemblyscript":
      return "wasm-as";
    case "wasm/rust":
      return "wasm-rs";
    case "interface":
      throw Error(intlMsg.lib_language_noInterfaceCodegen());
    default:
      throw Error(
        intlMsg.lib_language_unsupportedManifestLanguage({
          language: manifestLanguage,
          supported: Object.keys(polywrapManifestLanguages).join(", "),
        })
      );
  }
}
