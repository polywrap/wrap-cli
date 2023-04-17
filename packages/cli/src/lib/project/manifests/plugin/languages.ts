import { intlMsg } from "../../../intl";

import { BindLanguage } from "@polywrap/schema-bind";

export const pluginManifestLanguages = {
  "plugin/typescript": "plugin/typescript",
  "plugin/rust": "plugin/rust",
  "plugin/python": "plugin/python",
};

export type PluginManifestLanguages = typeof pluginManifestLanguages;

export type PluginManifestLanguage = keyof PluginManifestLanguages;

export function isPluginManifestLanguage(
  language: string
): language is PluginManifestLanguage {
  return language in pluginManifestLanguages;
}

export function pluginManifestLanguageToBindLanguage(
  manifestLanguage: PluginManifestLanguage
): BindLanguage {
  switch (manifestLanguage) {
    case "plugin/typescript":
      return "plugin-ts";
    case "plugin/rust":
      return "plugin-rs";
    case "plugin/python":
      return "plugin-py";
    default:
      throw Error(
        intlMsg.lib_language_unsupportedManifestLanguage({
          language: manifestLanguage,
          supported: Object.keys(pluginManifestLanguages).join(", "),
        })
      );
  }
}

// By default, codegen is placed in a directory next to the
// `module:` file, specified within the project manifest source section.
export function pluginManifestOverrideCodegenDir(
  manifestLanguage: PluginManifestLanguage
): string | undefined {
  switch (manifestLanguage) {
    // For rust, `module:` is set to `Cargo.toml`, so we override
    // the codegen directory to be `./src/wrap`
    case "plugin/rust":
      return "./src/wrap";
    default:
      return undefined;
  }
}
