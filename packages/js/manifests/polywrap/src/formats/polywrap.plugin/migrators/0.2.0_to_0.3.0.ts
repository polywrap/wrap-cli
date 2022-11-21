import { ILogger } from "@polywrap/logging-js";
import { PluginManifest as OldManifest } from "../0.2.0";
import { PluginManifest as NewManifest } from "../0.3.0";

export function migrate(migrate: OldManifest, logger?: ILogger): NewManifest {
  if (migrate.extensions?.meta) {
    logger?.warn(
      `The Polywarp Meta Manifests has been deprecated for plugin projects.`
    );
  }
  return {
    ...migrate,
    format: "0.3.0",
  };
}
