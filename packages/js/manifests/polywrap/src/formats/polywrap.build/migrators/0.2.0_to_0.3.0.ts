import { BuildManifest as OldManifest } from "../0.2.0";
import { BuildManifest as NewManifest } from "../0.3.0";

export function migrate(old: OldManifest): NewManifest {
  return {
    ...old,
    project: "polywrap.yaml",
    format: "0.3.0"
  };
}
