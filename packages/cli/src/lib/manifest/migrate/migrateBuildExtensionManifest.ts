import {
  AnyBuildManifest,
  latestBuildManifestFormat,
  migrateBuildManifest,
} from "@polywrap/polywrap-manifest-types-js";
import YAML from "js-yaml";

export function migrateBuildExtensionManifest(manifestString: string): string {
  let manifest: AnyBuildManifest | undefined;
  try {
    manifest = JSON.parse(manifestString) as AnyBuildManifest;
  } catch (e) {
    manifest = YAML.safeLoad(manifestString) as AnyBuildManifest | undefined;
  }

  if (!manifest) {
    throw Error(`Unable to parse BuildManifest: ${manifestString}`);
  }

  const newManifest = migrateBuildManifest(manifest, latestBuildManifestFormat);

  const cleanedManifest = JSON.parse(JSON.stringify(newManifest));
  delete cleanedManifest.__type;

  return YAML.dump(cleanedManifest);
}
