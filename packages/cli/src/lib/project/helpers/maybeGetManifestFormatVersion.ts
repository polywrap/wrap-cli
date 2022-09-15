import YAML from "js-yaml";

export function maybeGetManifestFormatVersion(
  manifestStr: string): string | undefined {
  type ManifestFormatProps = {
    format: string;
  };

  let manifest: ManifestFormatProps | undefined;

  try {
    manifest = JSON.parse(manifestStr) as ManifestFormatProps;
  } catch (e) {
    manifest = YAML.safeLoad(manifestStr) as ManifestFormatProps | undefined;
  }

  return manifest?.format;
}
