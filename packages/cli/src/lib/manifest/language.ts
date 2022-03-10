import {
  Web3ApiManifestLanguage,
  PluginManifestLanguage,
  AppManifestLanguage,
} from "./";

export type AnyManifestLanguage =
  | Web3ApiManifestLanguage
  | PluginManifestLanguage
  | AppManifestLanguage;
