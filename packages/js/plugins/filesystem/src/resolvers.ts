import { Query } from "./w3";

import path from "path";
import fs from "fs";
import { EResolveUriErrorType, ResolveUriError } from "@web3api/core-js";

export const query = (): Query.Module => ({
  // uri-resolver.core.web3api.eth
  tryResolveUri: async (input: Query.Input_tryResolveUri) => {
    if (input.authority !== "fs") {
      return null;
    }

    const manifestSearchPatterns = [
      "web3api.json",
      "web3api.yaml",
      "web3api.yml",
    ];

    let manifest: string | undefined;
    let error: ResolveUriError | undefined;

    for (const manifestSearchPattern of manifestSearchPatterns) {
      const manifestPath = path.resolve(input.path, manifestSearchPattern);

      if (fs.existsSync(manifestPath)) {
        try {
          manifest = fs.readFileSync(manifestPath, "utf-8");
        } catch (e) {
          error = {
            type: EResolveUriErrorType.Fs,
            error: e,
          };
          // TODO: logging
        }
      }
    }

    if (manifest) {
      return { uri: null, manifest };
    } else {
      // Noting found
      return { uri: null, manifest: null, error };
    }
  },
  getFile: async (_input: Query.Input_getFile) => {
    try {
      return await fs.promises.readFile(_input.path);
    } catch (e) {
      return null;
    }
  },
});
