import {
  AnyBuildManifest,
  BuildManifest,
  BuildManifestFormats,
  latestBuildManifestFormat
} from ".";


import { Tracer } from "@web3api/tracing";

type Migrator = {
  [key in BuildManifestFormats]?: (m: AnyBuildManifest) => BuildManifest;
};

export const migrators: Migrator = {
};

export const migrateBuildManifest = Tracer.traceFunc(
  "core: migrateBuildManifest",
  (manifest: AnyBuildManifest, to: BuildManifestFormats): BuildManifest => {
    const from = manifest.format as BuildManifestFormats;

    if (from === latestBuildManifestFormat) {
      return manifest as BuildManifest;
    }

    if (!(from in BuildManifestFormats)) {
      throw new Error(`Unrecognized BuildManifestFormat "${manifest.format}"`);
    }

    throw new Error(`This should never happen, BuildManifest migrators is empty. from: ${from}, to: ${to}`);
  }
);
