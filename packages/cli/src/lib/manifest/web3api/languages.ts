import { intlMsg } from "../../intl";

import { BindLanguage } from "@polywrap/schema-bind";

export const web3apiManifestLanguages = {
  "wasm/assemblyscript": "wasm/assemblyscript",
  "wasm/rust": "wasm/rust",
  interface: "interface",
};

export type Web3ApiManifestLanguages = typeof web3apiManifestLanguages;

export type Web3ApiManifestLanguage = keyof Web3ApiManifestLanguages;

export function isWeb3ApiManifestLanguage(
  language: string
): language is Web3ApiManifestLanguage {
  return language in web3apiManifestLanguages;
}

export function web3apiManifestLanguageToBindLanguage(
  manifestLanguage: Web3ApiManifestLanguage
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
          supported: Object.keys(web3apiManifestLanguages).join(", "),
        })
      );
  }
}
