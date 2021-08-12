import { EnsPlugin } from "./";
import { Query } from "./w3";

import { Client } from "@web3api/core-js";

export const query = (ens: EnsPlugin, client: Client): Query.Module => ({
  // uri-resolver.core.web3api.eth
  tryResolveUri: async (input: Query.Input_tryResolveUri) => {
    if (input.authority !== "ens") {
      return undefined;
    }

    try {
      const cid = await ens.ensToCID(input.path, client);

      if (!cid) {
        return undefined;
      }

      return {
        uri: `ipfs/${cid}`,
        manifest: undefined,
      };
    } catch (e) {
      // TODO: logging https://github.com/web3-api/monorepo/issues/33
    }

    // Nothing found
    return { uri: undefined, manifest: undefined };
  },
  getFile: async (_input: Query.Input_getFile) => {
    return undefined;
  },
});
