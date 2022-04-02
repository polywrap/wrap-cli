/* eslint-disable @typescript-eslint/naming-convention */

import { Web3ApiManifest as OldManifest } from "../0.0.1-prealpha.7";
import { Web3ApiManifest as NewManifest } from "../0.0.1-prealpha.8";
import { RUNTIME_VERSION } from "../../../../version";

export function migrate(old: OldManifest): NewManifest {
  return {
    ...old,
    format: "0.0.1-prealpha.8",
    targets: RUNTIME_VERSION,
  };
}
