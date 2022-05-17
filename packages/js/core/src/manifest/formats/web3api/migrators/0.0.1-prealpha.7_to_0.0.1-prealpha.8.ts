/* eslint-disable @typescript-eslint/naming-convention */

import { Web3ApiManifest as OldManifest } from "../0.0.1-prealpha.7";
import { Web3ApiManifest as NewManifest } from "../0.0.1-prealpha.8";

export function migrate(old: OldManifest): NewManifest {
  return {
    ...old,
    __type: "Web3ApiManifest",
    format: "0.0.1-prealpha.8",
  };
}
