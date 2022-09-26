import { migrateAnyManifest } from "./migrateAnyManifest";

import {
  AnyAppManifest,
  latestAppManifestFormat,
  migrateAppManifest,
} from "@polywrap/polywrap-manifest-types-js";

export function migrateAppProjectManifest(manifestString: string): string {
  return migrateAnyManifest(
    manifestString,
    "AppManifest",
    (manifest: AnyAppManifest) =>
      migrateAppManifest(manifest, latestAppManifestFormat)
  );
}
