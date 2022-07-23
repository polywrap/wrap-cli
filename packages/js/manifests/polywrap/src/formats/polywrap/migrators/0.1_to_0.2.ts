/* eslint-disable @typescript-eslint/naming-convention */

import { PolywrapManifest as OldManifest } from "../0.1";
import { PolywrapManifest as NewManifest } from "../0.2";

export function migrate(_: OldManifest): NewManifest {
  throw new Error(
    "Polywrap manifest file is deprecated. Please update to 0.2"
  );
}
