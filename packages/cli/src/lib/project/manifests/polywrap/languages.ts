import { intlMsg } from "../../../intl";

import { BindLanguage } from "@polywrap/schema-bind";

export const polywrapManifestLanguages = {
  "wasm/assemblyscript": "wasm/assemblyscript",
  "wasm/rust": "wasm/rust",
  "wasm/golang": "wasm/golang",
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
    case "wasm/golang":
      return "wasm-go";
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
      return "./main";
    default:
      return undefined;
  }
}
