import { migrateAnyManifest } from "./migrateAnyManifest";

import { migratePluginManifest } from "@polywrap/polywrap-manifest-types-js";

export function migratePluginProjectManifest(
  manifestString: string,
  to: string
): string {
  return migrateAnyManifest(
    manifestString,
    "PluginManifest",
    migratePluginManifest,
    to
  );
}
