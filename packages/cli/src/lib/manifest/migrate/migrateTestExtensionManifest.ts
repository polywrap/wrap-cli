import { migrateAnyManifest } from "./migrateAnyManifest";

import {
  AnyPolywrapWorkflow,
  latestPolywrapWorkflowFormat,
  migratePolywrapWorkflow,
} from "@polywrap/polywrap-manifest-types-js";

export function migrateWorkflow(manifestString: string): string {
  return migrateAnyManifest(
    manifestString,
    "PolywrapWorkflow",
    (manifest: AnyPolywrapWorkflow) =>
      migratePolywrapWorkflow(manifest, latestPolywrapWorkflowFormat)
  );
}
