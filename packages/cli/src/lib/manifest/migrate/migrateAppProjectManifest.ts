import { migrateAnyManifest } from "./migrateAnyManifest";

import { migrateAppManifest } from "@polywrap/polywrap-manifest-types-js";

export function migrateAppProjectManifest(
  manifestString: string,
  to: string
): string {
  return migrateAnyManifest(
    manifestString,
    "AppManifest",
    migrateAppManifest,
    to
  );
}
