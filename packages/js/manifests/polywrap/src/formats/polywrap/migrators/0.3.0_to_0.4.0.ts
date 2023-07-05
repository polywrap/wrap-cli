import { PolywrapManifest as OldManifest } from "../0.3.0";
import { PolywrapManifest as NewManifest } from "../0.4.0";

import { ILogger } from "@polywrap/logging-js";

export function migrate(migrate: OldManifest, logger?: ILogger): NewManifest {
  logger?.info(
    `A new Docs manifest extension is available! Use 'polywrap docs init' to set up documentation for your Wrap.`
  );

  return {
    ...migrate,
    format: "0.4.0",
  };
}
