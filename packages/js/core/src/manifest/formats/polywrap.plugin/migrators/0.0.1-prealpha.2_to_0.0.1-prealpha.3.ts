/* eslint-disable @typescript-eslint/naming-convention */

import { PluginManifest as OldManifest } from "../0.0.1-prealpha.2";
import { PluginManifest as NewManifest } from "../0.0.1-prealpha.3";

export function migrate(_: OldManifest): NewManifest {
  throw new Error(
    "Plugin manifest file is deprecated. Please update to 0.0.1-prealpha.3"
  );
}
