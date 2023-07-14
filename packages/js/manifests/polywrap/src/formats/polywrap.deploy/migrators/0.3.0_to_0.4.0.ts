import { DeployManifest as OldManifest } from "../0.3.0";
import { DeployManifest as NewManifest } from "../0.4.0";

export function migrate(old: OldManifest): NewManifest {
  return {
    ...old,
    format: "0.4.0",
  };
}
