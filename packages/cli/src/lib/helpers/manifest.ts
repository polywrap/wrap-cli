import { displayPath } from "./path";
import { withSpinner } from "./spinner";

import fs from "fs";
import YAML from "js-yaml";
import { Manifest, deserializeManifest } from "@web3api/core-js";

export async function loadManifest(
  manifestPath: string,
  quiet = false
): Promise<Manifest> {
  const run = (): Promise<Manifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      throw Error(`Unable to load manifest: ${manifestPath}`);
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
      `Load web3api from ${manifestPath}`,
      `Failed to load web3api from ${manifestPath}`,
      `Warnings loading web3api from ${manifestPath}`,
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
      throw Error(`Unable to dump manifest: ${manifest}`);
    }

    fs.writeFileSync(manifestPath, str, "utf-8");
  };

  if (quiet) {
    return run();
  } else {
    manifestPath = displayPath(manifestPath);

    return await withSpinner(
      `Output web3api to ${manifestPath}`,
      `Failed to output web3api to ${manifestPath}`,
      `Warnings outputting web3api to ${manifestPath}`,
      (_spinner): Promise<unknown> => {
        return Promise.resolve(run());
      }
    );
  }
}
