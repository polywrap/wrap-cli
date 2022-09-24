import { migrateAnyManifest } from "./migrateAnyManifest";

import {
  AnyMetaManifest,
  latestMetaManifestFormat,
  migrateMetaManifest,
} from "@polywrap/polywrap-manifest-types-js";

export function migrateMetaExtensionManifest(manifestString: string): string {
  return migrateAnyManifest(
    manifestString,
    "MetaManifest",
    (manifest: AnyMetaManifest) =>
      migrateMetaManifest(manifest, latestMetaManifestFormat)
  );
}
