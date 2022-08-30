import { intlMsg } from "../../../intl";
import { PolywrapProject } from "../../PolywrapProject";

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

export async function getGenerationSubpath(
  project: PolywrapProject
): Promise<string | undefined> {
  const manifest = await project.getManifest();
  const manifestLanguage = await project.getManifestLanguage();
  const module = manifest.source.module;

  switch (manifestLanguage) {
    case "wasm/rust":
      if (module && module.indexOf("Cargo.toml") === -1) {
        throw Error(intlMsg.lib_wasm_rust_invalidModule({ path: module }));
      }
      return "src/wrap";
    default:
      return undefined;
  }
}
