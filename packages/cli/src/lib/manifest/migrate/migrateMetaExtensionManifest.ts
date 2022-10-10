import { migrateAnyManifest } from "./migrateAnyManifest";

import { migrateMetaManifest } from "@polywrap/polywrap-manifest-types-js";

export function migrateMetaExtensionManifest(
  manifestString: string,
  to: string
): string {
  return migrateAnyManifest(
    manifestString,
    "MetaManifest",
    migrateMetaManifest,
    to
  );
}
