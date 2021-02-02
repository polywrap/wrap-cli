import { Web3ApiManifest } from "../Web3ApiManifest";
import { displayPath } from "./path";
import { withSpinner } from "./spinner";

import { Manifest } from "@web3api/core-js";

export const loadManifest = async (
  manifestPath: string,
  quiet = false
): Promise<Manifest> => {
  const run = () => {
    return Web3ApiManifest.load(manifestPath);
  };

  if (quiet) {
    return run();
  } else {
    manifestPath = displayPath(manifestPath);

    return await withSpinner(
      `Load web3api from ${manifestPath}`,
      `Failed to load web3api from ${manifestPath}`,
      `Warnings loading web3api from ${manifestPath}`,
      async (_spinner) => {
        return run();
      }
    );
  }
};
