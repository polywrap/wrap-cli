import { AnyManifest, Manifest, ManifestFormats } from "./formats";

import { Tracer } from "@web3api/tracing";

// TODO: uncomment when new version is created
/*import {
  migrate as migrate_0_0_1_prealpha_1_TO_0_0_1_prealpha_2
} from "./migrators/0_0_1-alpha.1-0_0_1-alpha.2";*/

type Migrator = {
  [key in ManifestFormats]?: (m: AnyManifest) => Manifest;
};

export const migrators: Migrator = {
  // TODO: uncomment when new version is created
  // "0.0.1-prealpha.1": migrate_0_0_1_prealpha_1_TO_0_0_1_prealpha_2
};

export const migrateManifest = (
  manifest: AnyManifest,
  to: ManifestFormats
): Manifest => {
  Tracer.startSpan("core: migrateManifest");
  Tracer.setAttribute("maniefst", manifest);
  Tracer.setAttribute("to", to);

  try {
    const from = manifest.format as ManifestFormats;

    if (!(from in ManifestFormats)) {
      throw new Error(`Unrecognized manifest format "${manifest.format}"`);
    }

    const migrator = migrators[from];
    if (!migrator) {
      throw new Error(
        `Format to update ${to} is not available in migrator of format ${from}`
      );
    }

    const result = migrator(manifest);

    Tracer.addEvent("migrate manifest finished", result);
    Tracer.endSpan();

    return result;
  } catch (error) {
    Tracer.recordException(error);
    Tracer.endSpan();

    throw error;
  }
};
