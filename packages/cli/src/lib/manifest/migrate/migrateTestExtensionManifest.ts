import { migrateAnyManifest } from "./migrateAnyManifest";

import { migratePolywrapWorkflow } from "@polywrap/polywrap-manifest-types-js";

export function migrateWorkflow(manifestString: string, to: string): string {
  return migrateAnyManifest(
    manifestString,
    "PolywrapWorkflow",
    migratePolywrapWorkflow,
    to
  );
}
