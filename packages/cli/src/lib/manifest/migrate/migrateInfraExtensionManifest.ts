import { migrateAnyManifest } from "./migrateAnyManifest";

import { migrateInfraManifest } from "@polywrap/polywrap-manifest-types-js";
import { ILogger } from "@polywrap/logging-js";

export function migrateInfraExtensionManifest(
  manifestString: string,
  to: string,
  logger?: ILogger
): string {
  return migrateAnyManifest(
    manifestString,
    "InfraManifest",
    migrateInfraManifest,
    to,
    logger
  );
}
