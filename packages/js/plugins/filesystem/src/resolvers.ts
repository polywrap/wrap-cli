import { Query } from "./w3";

import path from "path";
import fs from "fs";

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

    for (const manifestSearchPattern of manifestSearchPatterns) {
      const manifestPath = path.resolve(input.path, manifestSearchPattern);

      if (fs.existsSync(manifestPath)) {
        try {
          manifest = fs.readFileSync(manifestPath, "utf-8");
        } catch (e) {
          // TODO: logging
        }
      }
    }

    if (manifest) {
      return { uri: null, manifest };
    } else {
      // Noting found
      return { uri: null, manifest: null };
    }
  },
  getFile: async (input: Query.Input_getFile) => {
    try {
      console.log("get file", input.path);
      const res = fs.readFileSync(input.path);
      console.log("finished");
      return res;
    } catch (e) {
      return null;
    }
  },
});
