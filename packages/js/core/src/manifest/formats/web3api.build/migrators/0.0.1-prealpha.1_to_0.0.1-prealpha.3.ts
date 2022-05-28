/* eslint-disable @typescript-eslint/naming-convention */

import { BuildManifest as OldManifest } from "../0.0.1-prealpha.1";
import { BuildManifest as NewManifest } from "../0.0.1-prealpha.3";

export function migrate(old: OldManifest): NewManifest {
  return {
    ...old,
    __type: "BuildManifest",
    format: "0.0.1-prealpha.3",
  };
}
