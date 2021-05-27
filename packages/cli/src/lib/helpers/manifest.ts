import { displayPath } from "./path";
import { withSpinner } from "./spinner";
import { intlMsg } from "../intl";

import fs from "fs";
import YAML from "js-yaml";
import { writeFileSync } from "@web3api/os-js";
import { Manifest, deserializeManifest } from "@web3api/core-js";

export async function loadManifest(
  manifestPath: string,
  quiet = false
): Promise<Manifest> {
  const run = (): Promise<Manifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    try {
      const result = deserializeManifest(manifest);
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
    )) as Manifest;
  }
}

export async function outputManifest(
  manifest: Manifest,
  manifestPath: string,
  quiet = false
): Promise<unknown> {
  const run = () => {
    const str = YAML.safeDump(manifest);

    if (!str) {
      const noDumpMessage = intlMsg.lib_helpers_manifest_unableToDump({
        manifest: `${manifest}`,
      });
      throw Error(noDumpMessage);
    }

    writeFileSync(manifestPath, str, "utf-8");
  };

  if (quiet) {
    return run();
  } else {
    manifestPath = displayPath(manifestPath);
    return await withSpinner(
      intlMsg.lib_helpers_manifest_outputText({ path: manifestPath }),
      intlMsg.lib_helpers_manifest_outputError({ path: manifestPath }),
      intlMsg.lib_helpers_manifest_outputWarning({ path: manifestPath }),
      (_spinner): Promise<unknown> => {
        return Promise.resolve(run());
      }
    );
  }
}
