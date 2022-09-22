import {
  AnyPluginManifest,
  latestPluginManifestFormat,
  migratePluginManifest,
} from "@polywrap/polywrap-manifest-types-js";
import YAML from "js-yaml";

export function migratePluginProjectManifest(manifestString: string): string {
  let manifest: AnyPluginManifest | undefined;
  try {
    manifest = JSON.parse(manifestString) as AnyPluginManifest;
  } catch (e) {
    manifest = YAML.safeLoad(manifestString) as AnyPluginManifest | undefined;
  }

  if (!manifest) {
    throw Error(`Unable to parse PolywrapManifest: ${manifestString}`);
  }

  const newManifest = migratePluginManifest(
    manifest,
    latestPluginManifestFormat
  );

  const cleanedManifest = JSON.parse(JSON.stringify(newManifest));
  delete cleanedManifest.__type;

  return YAML.dump(cleanedManifest);
}
