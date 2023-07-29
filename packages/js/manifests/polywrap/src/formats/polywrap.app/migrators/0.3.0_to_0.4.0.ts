import { AppManifest as OldManifest } from "../0.3.0";
import { AppManifest as NewManifest } from "../0.4.0";

export function migrate(migrate: OldManifest): NewManifest {
  return {
    ...migrate,
    format: "0.4.0",
  };
}
