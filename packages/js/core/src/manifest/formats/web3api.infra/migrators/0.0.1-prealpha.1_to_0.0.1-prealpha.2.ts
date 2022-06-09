/* eslint-disable @typescript-eslint/naming-convention */

import { InfraManifest as OldManifest } from "../0.0.1-prealpha.1";
import { InfraManifest as NewManifest } from "../0.0.1-prealpha.2";

export function migrate(old: OldManifest): NewManifest {
  return {
    ...old,
    format: "0.0.1-prealpha.2",
  };
}
