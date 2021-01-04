import { EnsPlugin } from "./";

import { Client, PluginModule } from "@web3api/core-js";

export const query = (ens: EnsPlugin, client: Client): PluginModule => ({
  // w3://ens/uri-resolver.core.web3api.eth
  supportedUriAuthority: async (input: { authority: string }) => {
    return input.authority === "ens";
  },
  tryResolveUriPath: async (input: { uri: string }) => {
    try {
      return {
        uri: await ens.ensToCID(input.uri, client),
        manifest: null,
      };
    } catch (e) {
      // TODO: logging
    }

    // Nothing found
    return { uri: null, manifest: null };
  },
});
