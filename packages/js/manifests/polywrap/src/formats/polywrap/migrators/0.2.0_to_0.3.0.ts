import { ILogger } from "@polywrap/logging-js";
import { PolywrapManifest as OldManifest } from "../0.2.0";
import { PolywrapManifest as NewManifest } from "../0.3.0";

export function migrate(migrate: OldManifest, logger?: ILogger): NewManifest {
  if (migrate.extensions?.meta) {
    logger?.warn(
      `The Polywrap Meta Manifest has been deprecated, please use the new "resources" field in the Polywrap Manifest.`
    );
  }
  if (migrate.extensions?.build) {
    logger?.warn(
      `The Polywrap Build Manifest now references the Polywrap Manifest directly, please use the new "project" field in the Polywrap Build Manifest.`
    );
  }
  if (migrate.extensions) {
    logger?.warn(
      `The Polywrap Manifest Extensions concept has been removed, and instead has been renamed to Command Manifests.`
    );
    delete migrate.extensions;
  }
  return {
    ...migrate,
    format: "0.3.0",
  };
}
