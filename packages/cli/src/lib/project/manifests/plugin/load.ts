import { displayPath, Logger, logActivity, intlMsg } from "../../../";

import {
  PluginManifest,
  deserializePluginManifest,
} from "@polywrap/polywrap-manifest-types-js";
import fs from "fs";

export const defaultPluginManifest = [
  "polywrap.plugin.yaml",
  "polywrap.plugin.yml",
];

export async function loadPluginManifest(
  manifestPath: string,
  logger: Logger
): Promise<PluginManifest> {
  const run = (): Promise<PluginManifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    try {
      const result = deserializePluginManifest(manifest, { logger: logger });
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  manifestPath = displayPath(manifestPath);
  return await logActivity<PluginManifest>(
    logger,
    intlMsg.lib_helpers_manifest_loadText({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadError({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadWarning({ path: manifestPath }),
    async () => {
      return await run();
    }
  );
}
