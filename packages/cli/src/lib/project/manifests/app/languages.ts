import { intlMsg } from "../../../intl";

import { BindLanguage } from "@polywrap/schema-bind";

export const appManifestLanguages = {
  "app/typescript": "app/typescript",
};

export type AppManifestLanguages = typeof appManifestLanguages;

export type AppManifestLanguage = keyof AppManifestLanguages;

export function isAppManifestLanguage(
  language: string
): language is AppManifestLanguage {
  return language in appManifestLanguages;
}

export function appManifestLanguageToBindLanguage(
  manifestLanguage: AppManifestLanguage
): BindLanguage {
  switch (manifestLanguage) {
    case "app/typescript":
      return "app-ts";
    default:
      throw Error(
        intlMsg.lib_language_unsupportedManifestLanguage({
          language: manifestLanguage,
          supported: Object.keys(appManifestLanguages).join(", "),
        })
      );
  }
}
