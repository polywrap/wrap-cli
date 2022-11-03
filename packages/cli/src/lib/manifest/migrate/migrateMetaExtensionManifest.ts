import { migrateAnyManifest } from "./migrateAnyManifest";

import { migrateMetaManifest } from "@polywrap/polywrap-manifest-types-js";
import { ILogger } from "@polywrap/logging-js";

export function migrateMetaExtensionManifest(
  manifestString: string,
  to: string,
  logger?: ILogger
): string {
  return migrateAnyManifest(
    manifestString,
    "MetaManifest",
    migrateMetaManifest,
    to,
    logger
  );
}
