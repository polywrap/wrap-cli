import { migrateAnyManifest } from "./migrateAnyManifest";

import { migratePolywrapWorkflow } from "@polywrap/polywrap-manifest-types-js";
import { ILogger } from "@polywrap/logging-js";

export function migrateWorkflow(
  manifestString: string,
  to: string,
  logger?: ILogger
): string {
  return migrateAnyManifest(
    manifestString,
    "PolywrapWorkflow",
    migratePolywrapWorkflow,
    to,
    logger
  );
}
