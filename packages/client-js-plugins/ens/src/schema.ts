import { EnsPlugin } from "./";

import { QueryClient } from "@web3api/client-js";

export const Query = (ens: EnsPlugin, client: QueryClient) => ({
  // uri-resolver.core.web3api.eth
  supportedUri: async (input: { uri: string }) => {
    return EnsPlugin.isENSDomain(input.uri);
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
