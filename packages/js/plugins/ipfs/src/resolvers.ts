import { IpfsPlugin } from "./";

import { PluginModule } from "@web3api/core-js";

// TODO: generate types from the schema
// https://github.com/Web3-API/prototype/issues/101
export const mutation = (ipfs: IpfsPlugin): PluginModule => ({
  addFile: async (input: { data: Uint8Array }) => {
    const { path, cid } = await ipfs.add(input.data);
    return {
      path,
      cid,
    };
  },
});

export const query = (ipfs: IpfsPlugin): PluginModule => ({
  catFile: async (input: { cid: string }) => {
    return await ipfs.cat(input.cid);
  },
  // w3/api-resolver
  tryResolveUri: async (input: { authority: string; path: string }) => {
    if (input.authority !== "ipfs") {
      return null;
    }

    if (IpfsPlugin.isCID(input.path)) {
      // Try fetching uri/web3api.yaml
      try {
        return {
          manifest: await ipfs.catToString(`${input.path}/web3api.yaml`),
          uri: null,
        };
      } catch (e) {
        // TODO: logging
        // https://github.com/Web3-API/prototype/issues/33
      }

      // Try fetching uri/web3api.yml
      try {
        return {
          manifest: await ipfs.catToString(`${input.path}/web3api.yml`),
          uri: null,
        };
      } catch (e) {
        // TODO: logging
        // https://github.com/Web3-API/prototype/issues/33
      }
    }

    // Nothing found
    return { manifest: null, uri: null };
  },
  getFile: async (input: { path: string }) => {
    try {
      return await ipfs.catToBuffer(input.path);
    } catch (e) {
      return null;
    }
  },
});
