import { ILogger } from "@polywrap/logging-js";
import { PolywrapManifest as OldManifest } from "../0.2.0";
import { PolywrapManifest as NewManifest } from "../0.3.0";

export function migrate(migrate: OldManifest, logger?: ILogger): NewManifest {
  if (migrate.extensions?.meta) {
    logger?.warn(
      `The Polywrap Meta Manifest has been deprecated, please use the new "resources" field in the Polywrap Manifest.`
    );
    delete migrate.extensions.meta;
  }
  if (migrate.extensions?.deploy) {
    logger?.warn(
      `The Polywrap Deploy Manifest no longer needs to be listed as a project extension, and can be used as a standalone.`
    );
    delete migrate.extensions.deploy;
  }
  if (migrate.extensions?.infra) {
    logger?.warn(
      `The Polywrap Infra Manifest no longer needs to be listed as a project extension, and can be used as a standalone.`
    );
    delete migrate.extensions.infra;
  }
  return {
    ...migrate,
    format: "0.3.0",
  };
}
