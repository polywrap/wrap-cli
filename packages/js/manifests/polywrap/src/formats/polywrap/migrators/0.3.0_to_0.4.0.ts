import { ILogger } from "@polywrap/logging-js";
import { PolywrapManifest as OldManifest } from "../0.3.0";
import { PolywrapManifest as NewManifest } from "../0.4.0";

export function migrate(migrate: OldManifest, logger?: ILogger): NewManifest {
  if (migrate.extensions?.deploy) {
    logger?.warn(
      `The Polywrap Deploy Manifest does not needs to be defined in the Polywrap Manifest, feel free to remove it.`
    );
  }
  return {
    ...migrate,
    format: "0.4.0",
  };
}
