import { IpfsPlugin } from "./";

import { QueryResolver } from "@web3api/core-js";

// TODO: generate types from the schema
export const Mutation = (ipfs: IpfsPlugin): QueryResolver => ({
  addFile: async (input: { data: Uint8Array }) => {
    try {
      const result = await ipfs.add(input.data);
      return { data: {
        addFile: result
      }};
    } catch (e) {
      return { errors: [e] };
    }
  }
})

export const Query = (ipfs: IpfsPlugin): QueryResolver => ({
  catFile: async (input: { cid: string }) => {
    try {
      return { data: await ipfs.cat(input.cid) };
    } catch (e) {
      return { errors: [e] };
    }
  },
  // ens://api-resolver.core.web3api.eth
  getFile: async (input: { path: string }) => {
    try {
      return { data: await ipfs.catToBuffer(input.path) };
    } catch (e) { 
      return { data: null };
    }
  },
  // ens://uri-resolver.core.web3api.eth
  supportedScheme: async (input: { scheme: string }) => {
    return { data: input.scheme === "ipfs" };
  },
  tryResolveUri: async (input: { uri: string }) => {
    if (IpfsPlugin.isCID(input.uri)) {
      // Try fetching uri/web3api.yaml
      try {
        return { data: {
          manifest: await ipfs.catToString(`${input.uri}/web3api.yaml`),
          uri: null
        }};
      } catch (e) {
        // TODO: logging
      }

      // Try fetching uri/web3api.yml
      try {
        return { data: {
          manifest: await ipfs.catToString(`${input.uri}/web3api.yml`),
          uri: null
        }};
      } catch (e) {
        // TODO: logging
      }
    }

    // Nothing found
    return { data: { manifest: null, uri: null } };
  }
});
