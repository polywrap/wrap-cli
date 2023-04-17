/* eslint-disable no-empty */

import { ILogger } from "@polywrap/logging-js";
import YAML from "yaml";

export function migrateAnyManifest(
  manifestString: string,
  manifestTypeName: string,
  migrateFn: (manifest: unknown, to: string, logger?: ILogger) => unknown,
  to: string,
  logger?: ILogger
): string {
  let manifest: unknown | undefined;
  try {
    manifest = JSON.parse(manifestString);
  } catch (_) {
    try {
      manifest = YAML.parse(manifestString);
    } catch (_) {}
  }

  if (!manifest) {
    throw Error(`Unable to parse ${manifestTypeName}: ${manifestString}`);
  }

  const newManifest = migrateFn(manifest, to, logger);

  const cleanedManifest = JSON.parse(JSON.stringify(newManifest));
  delete cleanedManifest.__type;

  return YAML.stringify(cleanedManifest, null, 2);
}
