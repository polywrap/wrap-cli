/* eslint-disable @typescript-eslint/naming-convention */

import { PluginManifest as OldManifest } from "../0.1";
import { PluginManifest as NewManifest } from "../0.2";

export function migrate(_: OldManifest): NewManifest {
  throw new Error(
    "Plugin Polywrap manifest file is deprecated. Please update to 0.2"
  );
}
