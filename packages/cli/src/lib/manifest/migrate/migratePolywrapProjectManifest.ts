import { migrateAnyManifest } from "./migrateAnyManifest";

import { migratePolywrapManifest } from "@polywrap/polywrap-manifest-types-js";
import { ILogger } from "@polywrap/logging-js";

export function migratePolywrapProjectManifest(
  manifestString: string,
  to: string,
  logger?: ILogger
): string {
  return migrateAnyManifest(
    manifestString,
    "PolywrapManifest",
    migratePolywrapManifest,
    to,
    logger
  );
}
