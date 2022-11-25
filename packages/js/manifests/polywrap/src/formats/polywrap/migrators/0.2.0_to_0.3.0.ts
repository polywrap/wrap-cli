import { ILogger } from "@polywrap/logging-js";
import { PolywrapManifest as OldManifest } from "../0.2.0";
import { PolywrapManifest as NewManifest } from "../0.3.0";

export function migrate(migrate: OldManifest, logger?: ILogger): NewManifest {
  return {
    ...migrate,
    format: "0.3.0",
  };
}
