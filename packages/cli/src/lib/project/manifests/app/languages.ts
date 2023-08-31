import { intlMsg } from "../../../intl";

import { BindLanguage } from "@polywrap/schema-bind";

export const appManifestLanguages = {
  "app/typescript": "app/typescript",
  "app/python": "app/python",
  "app/kotlin": "app/kotlin",
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
    case "app/python":
      return "app-py";
    case "app/kotlin":
        return "app-kt";
    default:
      throw Error(
        intlMsg.lib_language_unsupportedManifestLanguage({
          language: manifestLanguage,
          supported: Object.keys(appManifestLanguages).join(", "),
        })
      );
  }
}
