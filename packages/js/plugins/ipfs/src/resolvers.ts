import { IpfsPlugin } from "./";
import { ResolveResult, Options } from "./types";

import { PluginModule } from "@web3api/core-js";

// TODO: generate types from the schema
// https://github.com/web3-api/monorepo/issues/101
export const mutation = (ipfs: IpfsPlugin): PluginModule => ({
  addFile: async (input: { data: Uint8Array }) => {
    const { hash } = await ipfs.add(input.data);
    return hash;
  },
});

export const query = (ipfs: IpfsPlugin): PluginModule => ({
  catFile: async (input: { cid: string; options?: Options }) => {
    return await ipfs.cat(input.cid, input.options);
  },
  resolve: async (input: {
    cid: string;
    options?: Options;
  }): Promise<ResolveResult> => {
    return await ipfs.resolve(input.cid, input.options);
  },
  // apiResolver
  tryResolveUri: async (input: { authority: string; path: string }) => {
    if (input.authority !== "ipfs") {
      return null;
    }

    if (IpfsPlugin.isCID(input.path)) {
      // Try fetching uri/web3api.yaml
      try {
        return {
          manifest: await ipfs.catToString(`${input.path}/web3api.yaml`, {
            timeout: 5000,
          }),
          uri: null,
        };
      } catch (e) {
        // TODO: logging
        // https://github.com/web3-api/monorepo/issues/33
      }

      // Try fetching uri/web3api.yml
      try {
        return {
          manifest: await ipfs.catToString(`${input.path}/web3api.yml`, {
            timeout: 5000,
          }),
          uri: null,
        };
      } catch (e) {
        // TODO: logging
        // https://github.com/web3-api/monorepo/issues/33
      }
    }

    // Nothing found
    return { manifest: null, uri: null };
  },
  getFile: async (input: { path: string }) => {
    try {
      const { cid, provider } = await ipfs.resolve(input.path, {
        timeout: 5000,
      });

      return await ipfs.cat(cid, {
        provider: provider,
      });
    } catch (e) {
      return null;
    }
  },
});
