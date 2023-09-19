import { defaultSchemaPath } from "../defaults";

import { AppManifest } from "@polywrap/polywrap-manifest-types-js";

export function applyAppManifestDefaults(
  manifest: AppManifest,
  manifestPath: string
): AppManifest {
  if (!manifest.source.schema) {
    manifest.source.schema = defaultSchemaPath(manifestPath);
  }
  return manifest;
}
