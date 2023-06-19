import { migrateAnyManifest } from "./migrateAnyManifest";

import { migrateDocsManifest } from "@polywrap/polywrap-manifest-types-js";
import { ILogger } from "@polywrap/logging-js";

export function migrateDocsExtensionManifest(
  manifestString: string,
  to: string,
  logger?: ILogger
): string {
  return migrateAnyManifest(
    manifestString,
    "DocsManifest",
    migrateDocsManifest,
    to,
    logger
  );
}
