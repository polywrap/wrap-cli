import { Query } from "./w3";

import path from "path";
import fs from "fs";

export const query = (): Query.Module => ({
  // uri-resolver.core.web3api.eth
  tryResolveUri: async (input: Query.Input_tryResolveUri) => {
    if (input.authority !== "fs") {
      return null;
    }

    // Try reading uri/web3api.yaml
    try {
      const manifestPath = path.resolve(input.path, "web3api.yaml");
      const manifest = await fs.promises.readFile(manifestPath, "utf8");
      return { uri: null, manifest: manifest };
    } catch (e) {
      // TODO: logging
    }

    // Try reading uri/web3api.yml
    try {
      const manifestPath = path.resolve(input.path, "web3api.yml");
      const manifest = await fs.promises.readFile(manifestPath, "utf8");
      return { uri: null, manifest: manifest };
    } catch (e) {
      // TODO: logging
    }

    // Nothing found
    return { manifest: null, uri: null };
  },
  getFile: async (_input: Query.Input_getFile) => {
    try {
      return await fs.promises.readFile(_input.path);
    } catch (e) {
      return null;
    }
  },
});
