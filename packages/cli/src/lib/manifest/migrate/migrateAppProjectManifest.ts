import { migrateAnyManifest } from "./migrateAnyManifest";

import { migrateAppManifest } from "@polywrap/polywrap-manifest-types-js";
import { ILogger } from "@polywrap/logging-js";

export function migrateAppProjectManifest(
  manifestString: string,
  to: string,
  logger?: ILogger
): string {
  return migrateAnyManifest(
    manifestString,
    "AppManifest",
    migrateAppManifest,
    to,
    logger
  );
}
