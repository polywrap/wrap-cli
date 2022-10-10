import { migrateAnyManifest } from "./migrateAnyManifest";

import { migrateDeployManifest } from "@polywrap/polywrap-manifest-types-js";

export function migrateDeployExtensionManifest(
  manifestString: string,
  to: string
): string {
  return migrateAnyManifest(
    manifestString,
    "DeployManifest",
    migrateDeployManifest,
    to
  );
}
