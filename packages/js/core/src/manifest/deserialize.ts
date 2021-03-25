import { AnyManifest, Manifest, latest, migrateManifest } from "./";
import { validateManifest } from "./validate";

import { compare } from "semver";
import YAML from "js-yaml";
import { Tracer } from "@web3api/tracing";

export interface DeserializeOptions {
  noValidate?: boolean;
}

export function deserializeManifest(
  manifest: string,
  options?: DeserializeOptions
): Manifest {
  Tracer.startSpan("core: deserializeManifest");
  Tracer.setAttribute("manifest", manifest);
  Tracer.setAttribute("options", options);

  const anyManifest = YAML.safeLoad(manifest) as AnyManifest | undefined;

  try {
    if (!anyManifest) {
      throw Error(`Unable to parse manifest: ${manifest}`);
    }
  } catch (error) {
    Tracer.recordException(error);
    Tracer.endSpan();

    throw error;
  }

  Tracer.addEvent("loaded manifest", anyManifest);

  if (!options || !options.noValidate) {
    validateManifest(anyManifest);
    Tracer.addEvent("manifest validation done");
  }

  if (compare(anyManifest.format, latest) === -1) {
    const result = migrateManifest(anyManifest, latest);

    Tracer.addEvent("migrated manifest", result);
    Tracer.endSpan();

    return result;
  } else {
    Tracer.addEvent("manifest is the latest one");
    Tracer.endSpan();

    return anyManifest as Manifest;
  }
}
