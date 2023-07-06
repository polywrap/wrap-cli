import { PolywrapManifestLanguage } from "../";

import { PolywrapManifest } from "@polywrap/polywrap-manifest-types-js";
import path from "path";
import fs from "fs";

export interface BuildOverrides {
  validateManifest?: (
    manifest: PolywrapManifest
  ) => Promise<void>;

  sourcesSubDirectory?: string;
}

export async function tryGetBuildOverrides(
  language: PolywrapManifestLanguage
): Promise<BuildOverrides | undefined> {
  const modulePath = path.join(
    __dirname,
    "..",
    "defaults",
    "language-overrides",
    language,
    "index.js"
  );
  let overrides: BuildOverrides | undefined;

  if (fs.existsSync(modulePath)) {
    const module = await import(modulePath);

    // Get any build overrides for the given build-image
    if (module.getBuildOverrides) {
      overrides = module.getBuildOverrides() as BuildOverrides;
    }
  }

  return Promise.resolve(overrides);
}
