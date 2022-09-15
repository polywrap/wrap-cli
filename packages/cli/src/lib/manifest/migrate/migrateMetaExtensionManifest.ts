import {
  AnyMetaManifest,
  latestMetaManifestFormat,
  migrateMetaManifest,
} from "@polywrap/polywrap-manifest-types-js";
import YAML from "js-yaml";

export function migrateMetaExtensionManifest(manifestString: string): string {
  let manifest: AnyMetaManifest | undefined;
  try {
    manifest = JSON.parse(manifestString) as AnyMetaManifest;
  } catch (e) {
    manifest = YAML.safeLoad(manifestString) as
      | AnyMetaManifest
      | undefined;
  }

  if (!manifest) {
    throw Error(`Unable to parse MetaManifest: ${manifestString}`);
  }

  const newManifest = migrateMetaManifest(
    manifest,
    latestMetaManifestFormat
  );

  const cleanedManifest = JSON.parse(JSON.stringify(newManifest));
  
  return YAML.dump(cleanedManifest);
}
