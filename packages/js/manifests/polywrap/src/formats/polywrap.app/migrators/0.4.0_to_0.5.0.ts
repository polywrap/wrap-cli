import { AppManifest as OldManifest } from "../0.4.0";
import { AppManifest as NewManifest } from "../0.5.0";

export function migrate(migrate: OldManifest): NewManifest {
  return {
    ...migrate,
    format: "0.5.0",
  };
}
