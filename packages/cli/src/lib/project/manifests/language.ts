import {
  PolywrapManifestLanguage,
  PluginManifestLanguage,
  AppManifestLanguage,
} from "./";

export type AnyProjectManifestLanguage =
  | PolywrapManifestLanguage
  | PluginManifestLanguage
  | AppManifestLanguage;

export type BuildableLanguage =
  | Exclude<PolywrapManifestLanguage, "interface" | "wasm/typescript">
  | "wasm/javascript";
