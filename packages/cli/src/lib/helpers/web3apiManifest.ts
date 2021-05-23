import { displayPath } from "./path";
import { withSpinner } from "./spinner";
import { intlMsg } from "../intl";

import fs from "fs";
import YAML from "js-yaml";
import { Web3ApiManifest, deserializeWeb3ApiManifest } from "@web3api/core-js";

export async function loadWeb3ApiManifest(
  manifestPath: string,
  quiet = false
): Promise<Web3ApiManifest> {
  const run = (): Promise<Web3ApiManifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    try {
      const result = deserializeWeb3ApiManifest(manifest);
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
    )) as Web3ApiManifest;
  }
}

export async function outputWeb3ApiManifest(
  manifest: Web3ApiManifest,
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

    fs.writeFileSync(manifestPath, str, "utf-8");
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
