/* eslint-disable @typescript-eslint/naming-convention */

import { AppManifest as OldManifest } from "../0.1";
import { AppManifest as NewManifest } from "../0.2";

export function migrate(_: OldManifest): NewManifest {
  throw new Error(
    "Polywrap App Manifest file is deprecated. Please update to 0.2"
  );
}
