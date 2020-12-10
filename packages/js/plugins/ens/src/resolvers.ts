import { EnsPlugin } from "./";

import { Client, QueryResolver } from "@web3api/core-js";

export const Query = (ens: EnsPlugin, client: Client): QueryResolver => ({
  // ens://uri-resolver.core.web3api.eth
  supportedScheme: async (input: { uri: string }) => {
    return { data: input.uri === "ens" };
  },
  tryResolveUri: async (input: { uri: string }) => {
    try {
      return { data: {
        uri: await ens.ensToCID(input.uri, client),
        manifest: null
      }}
    } catch (e) {
      // TODO: logging
    }

    // Nothing found
    return { uri: null, manifest: null};
  }
});
