import {
  AnyPolywrapManifest,
  latestPolywrapManifestFormat,
  migratePolywrapManifest,
} from "@polywrap/polywrap-manifest-types-js";
import YAML from "js-yaml";

export function migratePolywrapProjectManifest(manifestString: string): string {
  let manifest: AnyPolywrapManifest | undefined;
  try {
    manifest = JSON.parse(manifestString) as AnyPolywrapManifest;
  } catch (e) {
    manifest = YAML.safeLoad(manifestString) as AnyPolywrapManifest | undefined;
  }

  if (!manifest) {
    throw Error(`Unable to parse PolywrapManifest: ${manifestString}`);
  }

  const newManifest = migratePolywrapManifest(
    manifest,
    latestPolywrapManifestFormat
  );

  const cleanedManifest = JSON.parse(JSON.stringify(newManifest));
  delete cleanedManifest.__type;

  return YAML.dump(cleanedManifest);
}
