import { displayPath, withSpinner, intlMsg } from "../../../";

import {
  AppManifest,
  deserializeAppManifest,
} from "@polywrap/polywrap-manifest-types-js";
import fs from "fs";

export const defaultAppManifest = [
  "polywrap.yaml",
  "polywrap.app.yaml",
  "polywrap.app.yml",
];

export async function loadAppManifest(
  manifestPath: string,
  quiet = false
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

  if (quiet) {
    return await run();
  } else {
    manifestPath = displayPath(manifestPath);
    return (await withSpinner(
      intlMsg.lib_helpers_manifest_loadText({ path: manifestPath }),
      intlMsg.lib_helpers_manifest_loadError({ path: manifestPath }),
      intlMsg.lib_helpers_manifest_loadWarning({ path: manifestPath }),
      async (_spinner) => {
        return await run();
      }
    )) as AppManifest;
  }
}
