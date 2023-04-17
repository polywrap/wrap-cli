import { migrateAnyManifest } from "./migrateAnyManifest";

import { migrateBuildManifest } from "@polywrap/polywrap-manifest-types-js";
import { ILogger } from "@polywrap/logging-js";

export function migrateBuildExtensionManifest(
  manifestString: string,
  to: string,
  logger?: ILogger
): string {
  return migrateAnyManifest(
    manifestString,
    "BuildManifest",
    migrateBuildManifest,
    to,
    logger
  );
}
