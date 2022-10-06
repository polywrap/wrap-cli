import { migrateAnyManifest } from "./migrateAnyManifest";

import { migrateInfraManifest } from "@polywrap/polywrap-manifest-types-js";

export function migrateInfraExtensionManifest(
  manifestString: string,
  to: string
): string {
  return migrateAnyManifest(
    manifestString,
    "InfraManifest",
    migrateInfraManifest,
    to
  );
}
