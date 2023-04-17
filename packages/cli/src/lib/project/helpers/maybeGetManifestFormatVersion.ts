/* eslint-disable no-empty */

import YAML from "yaml";

export function maybeGetManifestFormatVersion(
  manifestStr: string
): string | undefined {
  type ManifestFormatProps = {
    format: string;
  };

  let manifest: ManifestFormatProps | undefined;

  try {
    manifest = JSON.parse(manifestStr) as ManifestFormatProps;
  } catch (_) {
    try {
      manifest = YAML.parse(manifestStr) as ManifestFormatProps;
    } catch (_) {}
  }

  return manifest?.format;
}
