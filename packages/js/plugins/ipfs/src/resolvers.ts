import { IpfsPlugin } from "./";

import { PluginModule } from "@web3api/core-js";

// TODO: generate types from the schema
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
  // w3://ens/api-resolver.core.web3api.eth
  getFile: async (input: { path: string }) => {
    try {
      return await ipfs.catToBuffer(input.path);
    } catch (e) {
      return null;
    }
  },
  // w3://ens/uri-resolver.core.web3api.eth
  supportedUriAuthority: async (input: { authority: string }) => {
    return input.authority === "ipfs";
  },
  tryResolveUriPath: async (input: { path: string }) => {
    if (IpfsPlugin.isCID(input.path)) {
      // Try fetching uri/web3api.yaml
      try {
        return {
          manifest: await ipfs.catToString(`${input.path}/web3api.yaml`),
          uri: null,
        };
      } catch (e) {
        // TODO: logging
      }

      // Try fetching uri/web3api.yml
      try {
        return {
          manifest: await ipfs.catToString(`${input.path}/web3api.yml`),
          uri: null,
        };
      } catch (e) {
        // TODO: logging
      }
    }

    // Nothing found
    return { manifest: null, uri: null };
  },
});
