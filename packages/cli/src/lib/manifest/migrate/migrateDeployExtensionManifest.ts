import { migrateAnyManifest } from "./migrateAnyManifest";

import {
  AnyDeployManifest,
  latestDeployManifestFormat,
  migrateDeployManifest,
} from "@polywrap/polywrap-manifest-types-js";

export function migrateDeployExtensionManifest(manifestString: string): string {
  return migrateAnyManifest(
    manifestString,
    "DeployManifest",
    (manifest: AnyDeployManifest) =>
      migrateDeployManifest(manifest, latestDeployManifestFormat)
  );
}
