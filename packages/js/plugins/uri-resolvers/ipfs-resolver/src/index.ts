import {
  Args_getFile,
  Args_tryResolveUri,
  Bytes,
  Client,
  Ipfs_Module,
  manifest,
  Module,
  UriResolver_MaybeUriOrManifest,
} from "./wrap";

import { PluginFactory } from "@polywrap/core-js";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const isIPFS = require("is-ipfs");

type NoConfig = Record<string, never>;

export class IpfsResolverPlugin extends Module<NoConfig> {
  // uri-resolver.core.polywrap.eth
  public async tryResolveUri(
    args: Args_tryResolveUri,
    _client: Client
  ): Promise<UriResolver_MaybeUriOrManifest | null> {
    if (args.authority !== "ipfs") {
      return null;
    }

    if (!IpfsResolverPlugin.isCID(args.path)) {
      // Not a valid CID
      return { manifest: null, uri: null };
    }

    const manifestSearchPattern = "wrap.info";

    let manifest: Bytes | undefined;

    try {
      const manifestResult = await Ipfs_Module.cat(
        {
          cid: `${args.path}/${manifestSearchPattern}`,
          options: {
            timeout: this.env.timeouts?.tryResolveUri,
            disableParallelRequests: this.env.disableParallelRequests,
          },
        },
        _client
      );

      if (manifestResult.data) {
        manifest = Buffer.from(manifestResult.data);
      } else {
        throw new Error();
      }
    } catch (e) {
      // TODO: logging
      // https://github.com/polywrap/monorepo/issues/33
    }

    return { uri: null, manifest: manifest ?? null };
  }

  public async getFile(
    args: Args_getFile,
    client: Client
  ): Promise<Bytes | null> {
    try {
      let provider: string | undefined = undefined;

      if (!this.env.skipCheckIfExistsBeforeGetFile) {
        const resolveResult = await Ipfs_Module.resolve(
          {
            cid: args.path,
            options: {
              timeout: this.env.timeouts?.checkIfExists,
              disableParallelRequests: this.env.disableParallelRequests,
            },
          },
          client
        );

        const result = resolveResult.data;

        if (!result) {
          return null;
        }

        provider = result.provider;
      }

      const catResult = await Ipfs_Module.cat(
        {
          cid: args.path,
          options: {
            provider: provider,
            timeout: this.env.timeouts?.getFile,
            disableParallelRequests: this.env.disableParallelRequests,
          },
        },
        client
      );

      return catResult.data ?? null;
    } catch (e) {
      return null;
    }
  }

  private static isCID(cid: string): boolean {
    return isIPFS.cid(cid) || isIPFS.cidPath(cid) || isIPFS.ipfsPath(cid);
  }
}

export const ipfsResolverPlugin: PluginFactory<NoConfig> = () => {
  return {
    factory: () => new IpfsResolverPlugin({}),
    manifest,
  };
};

export const plugin = ipfsResolverPlugin;
