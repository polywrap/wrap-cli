import {
  AnyInfraManifest,
  latestInfraManifestFormat,
  migrateInfraManifest,
} from "@polywrap/polywrap-manifest-types-js";
import YAML from "js-yaml";

export function migrateInfraExtensionManifest(manifestString: string): string {
  let manifest: AnyInfraManifest | undefined;
  try {
    manifest = JSON.parse(manifestString) as AnyInfraManifest;
  } catch (e) {
    manifest = YAML.safeLoad(manifestString) as AnyInfraManifest | undefined;
  }

  if (!manifest) {
    throw Error(`Unable to parse BuildManifest: ${manifestString}`);
  }

  const newManifest = migrateInfraManifest(manifest, latestInfraManifestFormat);

  const cleanedManifest = JSON.parse(JSON.stringify(newManifest));

  return YAML.dump(cleanedManifest);
}
