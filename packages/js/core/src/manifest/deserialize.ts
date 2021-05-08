import { AnyManifest, Manifest, latest, migrateManifest } from "./";
import { validateManifest } from "./validate";

import { compare } from "semver";
import YAML from "js-yaml";
import { Tracer } from "@web3api/tracing";

export interface DeserializeOptions {
  noValidate?: boolean;
}

export const deserializeManifest = Tracer.traceFunc(
  "core: deserializeManifest",(
    manifest: string,
    options?: DeserializeOptions
  ): Manifest => {
    const anyManifest = YAML.safeLoad(manifest) as AnyManifest | undefined;

    if (!anyManifest) {
      throw Error(`Unable to parse manifest: ${manifest}`);
    }

    if (!options || !options.noValidate) {
      validateManifest(anyManifest);
    }

    if (compare(anyManifest.format, latest) === -1) {
      return migrateManifest(anyManifest, latest);
    } else {
      return anyManifest as Manifest;
    }
  }
);
