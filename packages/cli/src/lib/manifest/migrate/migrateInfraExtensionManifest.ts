import { migrateAnyManifest } from "./migrateAnyManifest";

import {
  AnyInfraManifest,
  latestInfraManifestFormat,
  migrateInfraManifest,
} from "@polywrap/polywrap-manifest-types-js";

export function migrateInfraExtensionManifest(manifestString: string): string {
  return migrateAnyManifest(
    manifestString,
    "InfraManifest",
    (manifest: AnyInfraManifest) =>
      migrateInfraManifest(manifest, latestInfraManifestFormat)
  );
}
