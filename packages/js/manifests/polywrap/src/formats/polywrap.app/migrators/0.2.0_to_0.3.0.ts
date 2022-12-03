import { ILogger } from "@polywrap/logging-js";
import { AppManifest as OldManifest } from "../0.2.0";
import { AppManifest as NewManifest } from "../0.3.0";

export function migrate(migrate: OldManifest, logger?: ILogger): NewManifest {
  if (migrate.extensions?.meta) {
    logger?.warn(
      `The Polywrap Meta Manifest has been deprecated for app projects.`
    );
  }
  return {
    ...migrate,
    format: "0.3.0",
  };
}
