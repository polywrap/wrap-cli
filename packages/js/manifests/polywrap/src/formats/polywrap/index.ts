/* eslint-disable */
/**
 * This file was automatically generated by scripts/manifest/index-ts.mustache.
 * DO NOT MODIFY IT BY HAND. Instead, modify scripts/manifest/index-ts.mustache,
 * and run node ./scripts/manifest/generateFormatTypes.js to regenerate this file.
 */

import {
  PolywrapManifest as PolywrapManifest_0_1_0,
} from "./0.1.0";
import {
  PolywrapManifest as PolywrapManifest_0_2_0,
} from "./0.2.0";
import {
  PolywrapManifest as PolywrapManifest_0_3_0,
} from "./0.3.0";
import {
  PolywrapManifest as PolywrapManifest_0_4_0,
} from "./0.4.0";

export {
  PolywrapManifest_0_1_0,
  PolywrapManifest_0_2_0,
  PolywrapManifest_0_3_0,
  PolywrapManifest_0_4_0,
};

export enum PolywrapManifestFormats {
  // NOTE: Patch fix for backwards compatability
  "v0.1" = "0.1",
  "v0.1.0" = "0.1.0",
  "v0.2.0" = "0.2.0",
  "v0.3.0" = "0.3.0",
  "v0.4.0" = "0.4.0",
}

export const PolywrapManifestSchemaFiles: Record<string, string> = {
  // NOTE: Patch fix for backwards compatability
  "0.1": "formats/polywrap/0.1.0.json",
  "0.1.0": "formats/polywrap/0.1.0.json",
  "0.2.0": "formats/polywrap/0.2.0.json",
  "0.3.0": "formats/polywrap/0.3.0.json",
  "0.4.0": "formats/polywrap/0.4.0.json",
}

export type AnyPolywrapManifest =
  | PolywrapManifest_0_1_0
  | PolywrapManifest_0_2_0
  | PolywrapManifest_0_3_0
  | PolywrapManifest_0_4_0


export type PolywrapManifest = PolywrapManifest_0_4_0;

export const latestPolywrapManifestFormat = PolywrapManifestFormats["v0.4.0"]

export { migratePolywrapManifest } from "./migrate";

export { deserializePolywrapManifest } from "./deserialize";

export { validatePolywrapManifest } from "./validate";
