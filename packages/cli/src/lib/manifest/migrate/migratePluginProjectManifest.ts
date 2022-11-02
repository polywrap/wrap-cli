import { migrateAnyManifest } from "./migrateAnyManifest";

import { migratePluginManifest } from "@polywrap/polywrap-manifest-types-js";
import { ILogger } from "@polywrap/logging-js";

export function migratePluginProjectManifest(
  manifestString: string,
  to: string,
  logger?: ILogger
): string {
  return migrateAnyManifest(
    manifestString,
    "PluginManifest",
    migratePluginManifest,
    to,
    logger
  );
}
