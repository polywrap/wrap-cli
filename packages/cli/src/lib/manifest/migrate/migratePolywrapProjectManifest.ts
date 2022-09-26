import { migrateAnyManifest } from "./migrateAnyManifest";

import {
  AnyPolywrapManifest,
  latestPolywrapManifestFormat,
  migratePolywrapManifest,
} from "@polywrap/polywrap-manifest-types-js";

export function migratePolywrapProjectManifest(manifestString: string): string {
  return migrateAnyManifest(
    manifestString,
    "PolywrapManifest",
    (manifest: AnyPolywrapManifest) =>
      migratePolywrapManifest(manifest, latestPolywrapManifestFormat)
  );
}
