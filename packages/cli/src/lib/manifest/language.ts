import {
  PolywrapManifestLanguage,
  PluginManifestLanguage,
  AppManifestLanguage,
} from "./";

export type AnyManifestLanguage =
  | PolywrapManifestLanguage
  | PluginManifestLanguage
  | AppManifestLanguage;
