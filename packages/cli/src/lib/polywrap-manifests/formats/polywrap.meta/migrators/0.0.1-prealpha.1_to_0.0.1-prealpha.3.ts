/* eslint-disable @typescript-eslint/naming-convention */

import { MetaManifest as OldManifest } from "../0.0.1-prealpha.1";
import { MetaManifest as NewManifest } from "../0.0.1-prealpha.3";

export function migrate(old: OldManifest): NewManifest {
  const manifest: Record<string, unknown> = {
    ...old,
  };

  delete manifest.name;

  return {
    ...manifest,
    __type: "MetaManifest",
    format: "0.0.1-prealpha.3",
    displayName: old.name,
  };
}
