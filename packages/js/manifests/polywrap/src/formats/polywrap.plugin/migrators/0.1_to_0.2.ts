/* eslint-disable @typescript-eslint/naming-convention */

import { PluginManifest as OldManifest } from "../0.1";
import { PluginManifest as NewManifest } from "../0.2";

export function migrate(old: OldManifest): NewManifest {
  return {
    ...old,
    __type: "PluginManifest",
    format: "0.2",
  };
}
