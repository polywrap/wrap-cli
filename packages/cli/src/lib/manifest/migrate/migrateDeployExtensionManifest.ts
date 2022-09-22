import {
  AnyDeployManifest,
  latestDeployManifestFormat,
  migrateDeployManifest,
} from "@polywrap/polywrap-manifest-types-js";
import YAML from "js-yaml";

export function migrateDeployExtensionManifest(manifestString: string): string {
  let manifest: AnyDeployManifest | undefined;
  try {
    manifest = JSON.parse(manifestString) as AnyDeployManifest;
  } catch (e) {
    manifest = YAML.safeLoad(manifestString) as AnyDeployManifest | undefined;
  }

  if (!manifest) {
    throw Error(`Unable to parse DeployManifest: ${manifestString}`);
  }

  const newManifest = migrateDeployManifest(
    manifest,
    latestDeployManifestFormat
  );

  const cleanedManifest = JSON.parse(JSON.stringify(newManifest));
  delete cleanedManifest.__type;

  return YAML.dump(cleanedManifest);
}
