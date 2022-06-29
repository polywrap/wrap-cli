import {
  PolywrapManifestLanguage,
  PluginManifestLanguage,
  AppManifestLanguage,
} from "./";

export type AnyProjectManifestLanguage =
  | PolywrapManifestLanguage
  | PluginManifestLanguage
  | AppManifestLanguage;
