import { migrateAnyManifest } from "./migrateAnyManifest";

import {
  AnyBuildManifest,
  latestBuildManifestFormat,
  migrateBuildManifest,
} from "@polywrap/polywrap-manifest-types-js";

export function migrateBuildExtensionManifest(manifestString: string): string {
  return migrateAnyManifest(
    manifestString,
    "BuildManifest",
    (manifest: AnyBuildManifest) =>
      migrateBuildManifest(manifest, latestBuildManifestFormat)
  );
}
