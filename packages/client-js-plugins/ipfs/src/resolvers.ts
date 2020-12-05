import { IpfsPlugin } from "./";

export const Mutation = (ipfs: IpfsPlugin) => ({
  addFile: async (input: { data: Uint8Array }) => {
    return await ipfs.add(input.data);
  }
})

export const Query = (ipfs: IpfsPlugin) => ({
  catFile: async (input: { cid: string }) => {
    return await ipfs.cat(input.cid);
  },
  // api-resolver.core.web3api.eth
  getFile: async (input: { path: string }) => {
    try {
      return await ipfs.catToBuffer(input.path);
    } catch (e) { 
      return undefined;
    }
  },
  // uri-resolver.core.web3api.eth
  supportedUri: async (input: { uri: string }) => {
    return IpfsPlugin.isCID(input.uri);
  },
  tryResolveUri: async (input: { uri: string }) => {
    if (IpfsPlugin.isCID(input.uri)) {
      // Try fetching uri/web3api.yaml
      try {
        return {
          manifest: await ipfs.catToString(`${input.uri}/web3api.yaml`)
        };
      } catch (e) {
        // TODO: logging
      }

      // Try fetching uri/web3api.yml
      try {
        return {
          manifest: await ipfs.catToString(`${input.uri}/web3api.yml`)
        };
      } catch (e) {
        // TODO: logging
      }
    }

    // Nothing found
    return { };
  }
});
