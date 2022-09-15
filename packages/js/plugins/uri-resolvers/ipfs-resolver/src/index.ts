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

import { PluginFactory, PluginPackage } from "@polywrap/plugin-js";

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
            timeout: 5000,
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
      const resolveResult = await Ipfs_Module.resolve(
        {
          cid: args.path,
          options: {
            timeout: 5000,
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

      return catResult.data ?? null;
    } catch (e) {
      return null;
    }
  }

  private static isCID(cid: string): boolean {
    return isIPFS.cid(cid) || isIPFS.cidPath(cid) || isIPFS.ipfsPath(cid);
  }
}

export const ipfsResolverPlugin: PluginFactory<NoConfig> = () =>
  new PluginPackage(manifest, new IpfsResolverPlugin({}));

export const plugin = ipfsResolverPlugin;
