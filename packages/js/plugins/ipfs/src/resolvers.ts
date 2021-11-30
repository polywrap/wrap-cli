import { IpfsPlugin } from "./";
import { ResolveResult, Query, Mutation } from "./w3";

export const mutation = (ipfs: IpfsPlugin): Mutation.Module => ({
  addFile: async (input: Mutation.Input_addFile) => {
    const { hash } = await ipfs.add(input.data);
    return hash.toString();
  },
});

export const query = (ipfs: IpfsPlugin): Query.Module => ({
  catFile: async (input: Query.Input_catFile) => {
    return await ipfs.cat(input.cid, input.options || undefined);
  },
  resolve: async (input: Query.Input_resolve): Promise<ResolveResult> => {
    return await ipfs.resolve(input.cid, input.options || undefined);
  },
  // uri-resolver.core.web3api.eth
  tryResolveUri: async (input: Query.Input_tryResolveUri) => {
    if (input.authority !== "ipfs") {
      return null;
    }

    if (IpfsPlugin.isCID(input.path)) {
      // Try fetching uri/web3api.json
      try {
        return {
          manifest: await ipfs.catToString(`${input.path}/web3api.json`, {
            timeout: 5000,
          }),
          uri: null,
        };
      } catch (e) {
        // TODO: logging
        // https://github.com/web3-api/monorepo/issues/33
      }

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
  getFile: async (input: Query.Input_getFile) => {
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
