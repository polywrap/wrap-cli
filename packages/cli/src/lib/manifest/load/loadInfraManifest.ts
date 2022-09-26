import {
  displayPath,
  loadEnvironmentVariables,
  withSpinner,
  intlMsg,
} from "../../";

import fs from "fs";
import {
  InfraManifest,
  deserializeInfraManifest,
} from "@polywrap/polywrap-manifest-types-js";

export const defaultInfraManifest = [
  "polywrap.infra.yaml",
  "polywrap.infra.yml",
];

export async function loadInfraManifest(
  manifestPath: string,
  quiet = false
): Promise<InfraManifest> {
  const run = (): Promise<InfraManifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    try {
      let result = deserializeInfraManifest(manifest);
      result = (loadEnvironmentVariables(
        (result as unknown) as Record<string, unknown>
      ) as unknown) as InfraManifest;
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
      async () => {
        return await run();
      }
    )) as InfraManifest;
  }
}
