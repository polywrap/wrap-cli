import { migrateAnyManifest } from "./migrateAnyManifest";

import {
  AnyPluginManifest,
  latestPluginManifestFormat,
  migratePluginManifest,
} from "@polywrap/polywrap-manifest-types-js";

export function migratePluginProjectManifest(manifestString: string): string {
  return migrateAnyManifest(
    manifestString,
    "PluginManifest",
    (manifest: AnyPluginManifest) =>
      migratePluginManifest(manifest, latestPluginManifestFormat)
  );
}
