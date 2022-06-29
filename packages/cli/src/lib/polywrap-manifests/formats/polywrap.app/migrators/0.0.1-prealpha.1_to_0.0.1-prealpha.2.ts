/* eslint-disable @typescript-eslint/naming-convention */

import { AppManifest as OldManifest } from "../0.0.1-prealpha.1";
import { AppManifest as NewManifest } from "../0.0.1-prealpha.2";

export function migrate(old: OldManifest): NewManifest {
  return {
    ...old,
    __type: "AppManifest",
    format: "0.0.1-prealpha.2",
    name: "Unnamed",
  };
}
