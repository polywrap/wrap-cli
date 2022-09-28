import { AppManifest as OldManifest } from "../0.2.0";
import { AppManifest as NewManifest } from "../0.3.0";

export function migrate(manifest: OldManifest): NewManifest {
  return { ...manifest, format: "0.3.0" };
}
