import { migrateAnyManifest } from "./migrateAnyManifest";

import { migratePolywrapManifest } from "@polywrap/polywrap-manifest-types-js";

export function migratePolywrapProjectManifest(
  manifestString: string,
  to: string
): string {
  return migrateAnyManifest(
    manifestString,
    "PolywrapManifest",
    migratePolywrapManifest,
    to
  );
}
