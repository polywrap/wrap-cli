import YAML from "js-yaml";

export function migrateAnyManifest(
  manifestString: string,
  manifestTypeName: string,
  migrateFn: (manifest: unknown, to: string) => unknown,
  to: string
): string {
  let manifest: unknown | undefined;
  try {
    manifest = JSON.parse(manifestString);
  } catch (e) {
    manifest = YAML.safeLoad(manifestString) as unknown | undefined;
  }

  if (!manifest) {
    throw Error(`Unable to parse ${manifestTypeName}: ${manifestString}`);
  }
  
  const newManifest = migrateFn(manifest, to);

  const cleanedManifest = JSON.parse(JSON.stringify(newManifest));
  delete cleanedManifest.__type;

  return YAML.dump(cleanedManifest);
}
