import YAML from "yaml";

export function migrateAnyManifest(
  manifestString: string,
  manifestTypeName: string,
  migrateFn: (manifest: unknown) => unknown
): string {
  let manifest: unknown | undefined;
  try {
    manifest = JSON.parse(manifestString);
  } catch (_) {
    try {
      manifest = YAML.parse(manifestString);
    } catch (_) { }
  }

  if (!manifest) {
    throw Error(`Unable to parse ${manifestTypeName}: ${manifestString}`);
  }

  const newManifest = migrateFn(manifest);

  const cleanedManifest = JSON.parse(JSON.stringify(newManifest));
  delete cleanedManifest.__type;

  return YAML.stringify(cleanedManifest, null, 2);
}
