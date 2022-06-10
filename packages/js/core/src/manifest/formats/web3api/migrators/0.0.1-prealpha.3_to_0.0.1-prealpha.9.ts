/* eslint-disable @typescript-eslint/naming-convention */

import { Web3ApiManifest as OldManifest } from "../0.0.1-prealpha.3";
import { Web3ApiManifest as NewManifest } from "../0.0.1-prealpha.9";

export function migrate(_: OldManifest): NewManifest {
  throw new Error(
    "Manifest file is deprecated. Please update to 0.0.1-prealpha.9"
  );
}
