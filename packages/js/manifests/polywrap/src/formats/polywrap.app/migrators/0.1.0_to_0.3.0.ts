import { AppManifest as OldManifest } from "../0.1.0";
import { AppManifest as NewManifest } from "../0.3.0";
import { migrate as migrate_0_1_0_to_0_2_0 } from "./0.1.0_to_0.2.0";

export function migrate(manifest: OldManifest): NewManifest {
  return { ...migrate_0_1_0_to_0_2_0(manifest), format: "0.3.0" };
}
