import { migrateAnyManifest } from "./migrateAnyManifest";

import { migrateBuildManifest } from "@polywrap/polywrap-manifest-types-js";

export function migrateBuildExtensionManifest(
  manifestString: string,
  to: string
): string {
  return migrateAnyManifest(
    manifestString,
    "BuildManifest",
    migrateBuildManifest,
    to
  );
}
