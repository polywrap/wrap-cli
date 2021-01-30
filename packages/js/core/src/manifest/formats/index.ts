import { Manifest as Manifest0_0_1_prealpha_1 } from "./0.0.1-prealpha.1";
import { Manifest as Manifest0_0_1_prealpha_2 } from "./0.0.1-prealpha.2";

export enum ManifestFormats {
  "0.0.1-prealpha.1" = "0.0.1-prealpha.1",
  "0.0.1-prealpha.2" = "0.0.1-prealpha.2",
}

export type AnyManifest =
  Manifest0_0_1_prealpha_1 |
  Manifest0_0_1_prealpha_2;

export type Manifest = Manifest0_0_1_prealpha_2;

export const latest = ManifestFormats["0.0.1-prealpha.2"];
