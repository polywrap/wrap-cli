import {
  AnyPolywrapWorkflow,
  latestPolywrapWorkflowFormat,
  migratePolywrapWorkflow,
} from "@polywrap/polywrap-manifest-types-js";
import YAML from "js-yaml";

export function migrateWorkflow(manifestString: string): string {
  let manifest: AnyPolywrapWorkflow | undefined;
  try {
    manifest = JSON.parse(manifestString) as AnyPolywrapWorkflow;
  } catch (e) {
    manifest = YAML.safeLoad(manifestString) as AnyPolywrapWorkflow | undefined;
  }

  if (!manifest) {
    throw Error(`Unable to parse BuildManifest: ${manifestString}`);
  }

  const newManifest = migratePolywrapWorkflow(
    manifest,
    latestPolywrapWorkflowFormat
  );

  const cleanedManifest = JSON.parse(JSON.stringify(newManifest));

  return YAML.dump(cleanedManifest);
}
