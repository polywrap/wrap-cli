import {
  Module,
  Input_tryResolveUri,
  Input_getFile,
  Bytes,
  UriResolver_MaybeUriOrManifest,
  manifest,
  Ipfs_Module,
  Client,
} from "./wrap";

import { PluginFactory } from "@polywrap/core-js";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const isIPFS = require("is-ipfs");

export interface IpfsResolverPluginConfig extends Record<string, unknown> {
  provider: string;
  fallbackProviders?: string[];
}

export class IpfsResolverPlugin extends Module<IpfsResolverPluginConfig> {
  public static isCID(cid: string): boolean {
    return isIPFS.cid(cid) || isIPFS.cidPath(cid) || isIPFS.ipfsPath(cid);
  }

  // uri-resolver.core.web3api.eth
  public async tryResolveUri(
    input: Input_tryResolveUri,
    _client: Client
  ): Promise<UriResolver_MaybeUriOrManifest | null> {
    if (input.authority !== "ipfs") {
      return null;
    }

    if (!IpfsResolverPlugin.isCID(input.path)) {
      // Not a valid CID
      return { manifest: null, uri: null };
    }

    const manifestSearchPatterns = [
      "web3api.json",
      "web3api.yaml",
      "web3api.yml",
    ];

    let manifest: string | undefined;

    for (const manifestSearchPattern of manifestSearchPatterns) {
      try {
        const manifestResult = await Ipfs_Module.catToString(
          {
            cid: `${input.path}/${manifestSearchPattern}`,
            options: {
              timeout: 5000,
              disableParallelRequests: this.env.disableParallelRequests,
            },
          },
          _client
        );

        if (manifestResult.data) {
          manifest = manifestResult.data;
        } else {
          throw manifestResult.error;
        }
      } catch (e) {
        // TODO: logging
        // https://github.com/web3-api/monorepo/issues/33
      }
    }

    if (manifest) {
      return { uri: null, manifest };
    } else {
      // Nothing found
      return { uri: null, manifest: null };
    }
  }

  public async getFile(
    input: Input_getFile,
    client: Client
  ): Promise<Bytes | null> {
    try {
      const resolveResult = await Ipfs_Module.resolve(
        {
          cid: input.path,
          options: {
            timeout: 5000,
            disableParallelRequests: this.env.disableParallelRequests,
          },
        },
        client
      );

      const result = resolveResult.data;

      if (!result) {
        return null;
      }

      const catResult = await Ipfs_Module.cat(
        {
          cid: result.cid,
          options: {
            provider: result.provider,
            timeout: 20000,
            disableParallelRequests: true,
          },
        },
        client
      );

      if (catResult.data) {
        return catResult.data;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
}

export const ipfsResolverPlugin: PluginFactory<IpfsResolverPluginConfig> = (
  opts: IpfsResolverPluginConfig
) => {
  return {
    factory: () => new IpfsResolverPlugin(opts),
    manifest,
  };
};

export const plugin = ipfsResolverPlugin;
