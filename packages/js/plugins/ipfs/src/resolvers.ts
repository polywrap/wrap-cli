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

    if (!IpfsPlugin.isCID(input.path)) {
      // Not a valid CID
      return { manifest: null, uri: null };
    }

    const manifestSearchPatterns = [
      "web3api.json",
      "web3api.yaml",
      "web3api.yml"
    ];

    let manifest: string | undefined;

    for (const manifestSearchPattern of manifestSearchPatterns) {
      try {
        manifest = await ipfs.catToString(
          `${input.path}/${manifestSearchPattern}`,
          { timeout: 5000 }
        );
      } catch (e) {
        // TODO: logging
        // https://github.com/web3-api/monorepo/issues/33
      }
    }

    if (manifest) {
      return { uri: null, manifest };
    } else {
      // Noting found
      return { uri: null, manifest: null };
    }
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
