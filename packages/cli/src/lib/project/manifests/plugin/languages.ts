import { intlMsg } from "../../../intl";

import { BindLanguage } from "@polywrap/schema-bind";

export const pluginManifestLanguages = {
  "plugin/typescript": "plugin/typescript",
  "plugin/rust": "plugin/rust",
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
    default:
      throw Error(
        intlMsg.lib_language_unsupportedManifestLanguage({
          language: manifestLanguage,
          supported: Object.keys(pluginManifestLanguages).join(", "),
        })
      );
  }
}
