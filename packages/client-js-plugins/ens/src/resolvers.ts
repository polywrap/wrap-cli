import { EnsPlugin } from "./";

import { QueryClient } from "@web3api/client-js";

export const Query = (ens: EnsPlugin, client: QueryClient) => ({
  // ens://uri-resolver.core.web3api.eth
  supportedScheme: async (input: { uri: string }) => {
    return input.uri === "ens";
  },
  tryResolveUri: async (input: { uri: string }) => {
    try {
      return {
        uri: await ens.ensToCID(input.uri, client)
      }
    } catch (e) {
      // TODO: logging
    }

    // Nothing found
    return { };
  }
});
