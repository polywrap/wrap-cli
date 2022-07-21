/* eslint-disable @typescript-eslint/naming-convention */

import { PluginManifest as OldManifest } from "../0.1.0";
import { PluginManifest as NewManifest } from "../0.1.1";

export function migrate(_: OldManifest): NewManifest {
  throw new Error(
    "Plugin Polywrap manifest file is deprecated. Please update to 0.1.1"
  );
}
