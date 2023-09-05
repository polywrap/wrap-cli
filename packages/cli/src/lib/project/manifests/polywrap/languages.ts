import { intlMsg } from "../../../intl";

import { BindLanguage } from "@polywrap/schema-bind";

export const polywrapManifestLanguages = {
  "wasm/assemblyscript": "wasm/assemblyscript",
  "wasm/rust": "wasm/rust",
  "wasm/golang": "wasm/golang",
  "wasm/typescript": "wasm/typescript",
  interface: "interface",
};

export const polywrapBuildLanguages = {
  "wasm/assemblyscript": "wasm/assemblyscript",
  "wasm/rust": "wasm/rust",
  "wasm/golang": "wasm/golang",
  "wasm/javascript": "wasm/javascript",
};

export type PolywrapManifestLanguages = typeof polywrapManifestLanguages;

export type PolywrapManifestLanguage = keyof PolywrapManifestLanguages;

export type PolywrapBuildLanguages = typeof polywrapBuildLanguages;

export type PolywrapBuildLanguage = keyof PolywrapBuildLanguages;

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
      return "wrap-as";
    case "wasm/rust":
      return "wrap-rs";
    case "wasm/golang":
      return "wrap-go";
    case "wasm/typescript":
      return "wrap-ts";
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

// By default, codegen is placed in a directory next to the
// `module:` file, specified within the project manifest source section.
export function polywrapManifestOverrideCodegenDir(
  manifestLanguage: PolywrapManifestLanguage
): string | undefined {
  switch (manifestLanguage) {
    // For rust, `module:` is set to `Cargo.toml`, so we override
    // the codegen directory to be `./src/wrap`
    case "wasm/rust":
      return "./src/wrap";
    case "wasm/golang":
      return "./module/wrap";
    default:
      return undefined;
  }
}
