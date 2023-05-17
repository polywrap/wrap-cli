import { AppManifest as OldManifest } from "../0.3.0";
import { AppManifest as NewManifest } from "../0.4.0";

import { ILogger } from "@polywrap/logging-js";

export function migrate(migrate: OldManifest, _logger?: ILogger): NewManifest {
  return {
    ...migrate,
    format: "0.4.0",
  };
}
