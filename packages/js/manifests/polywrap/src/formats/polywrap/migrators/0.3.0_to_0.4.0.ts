import { ILogger } from "@polywrap/logging-js";
import { PolywrapManifest as OldManifest } from "../0.3.0";
import { PolywrapManifest as NewManifest } from "../0.4.0";

export function migrate(migrate: OldManifest, logger?: ILogger): NewManifest {
  if (migrate.extensions?.deploy) {
    logger?.warn(
      `The Polywrap Deploy Manifest ('extensions.deploy') is no longer used within the Polywrap Manifest and has been removed`
    );
    delete migrate.extensions.deploy;
  }
  return {
    ...migrate,
    format: "0.4.0",
  };
}
