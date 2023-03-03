/* eslint-disable @typescript-eslint/naming-convention */

import { DeployManifest as OldManifest } from "../0.2.0";
import { DeployManifest as NewManifest } from "../0.3.0";

export function migrate(old: OldManifest): NewManifest {
  return {
    __type: "DeployManifest",
    format: "0.3.0",
    primaryJobName: Object.keys(old.jobs)[0],
    jobs: old.jobs,
  };
}
