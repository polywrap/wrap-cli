import {
  displayPath,
  Logger,
  logActivity,
  intlMsg
} from "../../../";

import {
  AppManifest,
  deserializeAppManifest,
} from "@polywrap/polywrap-manifest-types-js";
import fs from "fs";

export const defaultAppManifest = ["polywrap.app.yaml", "polywrap.app.yml"];

export async function loadAppManifest(
  manifestPath: string,
  logger: Logger
): Promise<AppManifest> {
  const run = (): Promise<AppManifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");
    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    try {
      const result = deserializeAppManifest(manifest);
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  manifestPath = displayPath(manifestPath);
  return await logActivity<AppManifest>(
    logger,
    intlMsg.lib_helpers_manifest_loadText({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadError({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadWarning({ path: manifestPath }),
    async () => {
      return await run();
    }
  );
}
