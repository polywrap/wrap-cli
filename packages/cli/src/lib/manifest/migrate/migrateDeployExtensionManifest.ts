import { migrateAnyManifest } from "./migrateAnyManifest";

import { migrateDeployManifest } from "@polywrap/polywrap-manifest-types-js";
import { ILogger } from "@polywrap/logging-js";

export function migrateDeployExtensionManifest(
  manifestString: string,
  to: string,
  logger?: ILogger
): string {
  return migrateAnyManifest(
    manifestString,
    "DeployManifest",
    migrateDeployManifest,
    to,
    logger
  );
}
