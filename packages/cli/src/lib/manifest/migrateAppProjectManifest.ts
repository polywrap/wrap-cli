import {
  AnyAppManifest,
  latestAppManifestFormat,
  migrateAppManifest,
} from "@polywrap/polywrap-manifest-types-js";
import YAML from "js-yaml";

export function migrateAppProjectManifest(manifestString: string): string {
  let manifest: AnyAppManifest | undefined;
  try {
    manifest = JSON.parse(manifestString) as AnyAppManifest;
  } catch (e) {
    manifest = YAML.safeLoad(manifestString) as
      | AnyAppManifest
      | undefined;
  }
  
  if (!manifest) {
    throw Error(`Unable to parse AppManifest: ${manifestString}`);
  }

  const newManifest = migrateAppManifest(
    manifest,
    latestAppManifestFormat
  );

  const newManifestCleaned = JSON.parse(JSON.stringify(newManifest));

  return YAML.dump(newManifestCleaned);
}
