import { query, mutation } from "./resolvers";
import { manifest, Query, Mutation, Options, ResolveResult } from "./w3";

import {
  Client,
  Plugin,
  PluginFactory,
  PluginPackageManifest,
} from "@web3api/core-js";
import CID from "cids";
import AbortController from "abort-controller";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const isIPFS = require("is-ipfs");
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/naming-convention
const createIpfsClient = require("@dorgjelli-test/ipfs-http-client-lite");

interface IpfsClient {
  add(
    data: Uint8Array,
    options?: unknown
  ): Promise<
    {
      name: string;
      hash: CID;
    }[]
  >;

  cat(cid: string, options?: unknown): Promise<Buffer>;

  resolve(
    cid: string,
    options?: unknown
  ): Promise<{
    path: string;
  }>;
}

export interface IpfsConfig {
  provider: string;
  fallbackProviders?: string[];
}

export class IpfsPlugin extends Plugin {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: initialized within setProvider
  private _ipfs: IpfsClient;

  constructor(private _config: IpfsConfig) {
    super();
    this.setProvider(this._config.provider);
  }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public static isCID(cid: string): boolean {
    return isIPFS.cid(cid) || isIPFS.cidPath(cid) || isIPFS.ipfsPath(cid);
  }

  public getModules(
    _client: Client
  ): {
    query: Query.Module;
    mutation: Mutation.Module;
  } {
    return {
      query: query(this),
      mutation: mutation(this),
    };
  }

  public setProvider(provider: string): void {
    this._config.provider = provider;
    this._ipfs = createIpfsClient(provider);
  }

  public async add(
    data: Uint8Array
  ): Promise<{
    name: string;
    hash: CID;
  }> {
    const result = await this._ipfs.add(data);

    if (result.length === 0) {
      throw Error(
        `IpfsPlugin:add failed to add contents. Result of length 0 returned.`
      );
    }

    return result[0];
  }

  public async cat(cid: string, options?: Options): Promise<Buffer> {
    return await this._execWithOptions(
      "cat",
      (ipfs: IpfsClient, _provider: string, options: unknown) => {
        return ipfs.cat(cid, options);
      },
      options
    );
  }

  public async catToString(cid: string, options?: Options): Promise<string> {
    const buffer = await this.cat(cid, options);
    return buffer.toString("utf-8");
  }

  public async resolve(cid: string, options?: Options): Promise<ResolveResult> {
    return await this._execWithOptions(
      "resolve",
      async (ipfs: IpfsClient, provider: string, options: unknown) => {
        const { path } = await ipfs.resolve(cid, options);
        return {
          cid: path,
          provider,
        };
      },
      options
    );
  }

  private async _execWithOptions<TReturn>(
    operation: string,
    exec: (
      ipfs: IpfsClient,
      provider: string,
      options: unknown
    ) => Promise<TReturn>,
    options?: Options
  ): Promise<TReturn> {
    if (options) {
      const timeout = options.timeout || 0;
      const providerOverride = options.provider;

      if (timeout > 0) {
        let ipfs = this._ipfs;
        let provider = providerOverride || this._config.provider;
        let fallbackIdx = -1;
        let complete = false;
        let result: TReturn | undefined = undefined;

        while (!complete) {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), timeout);

          try {
            result = await exec(ipfs, provider, { signal: controller.signal });
          } catch (e) {
            // Handle abort logic below
          }

          clearTimeout(timer);

          if (this._config.fallbackProviders && !providerOverride) {
            // Retry with a new provider
            fallbackIdx += 1;

            if (fallbackIdx >= this._config.fallbackProviders.length) {
              complete = true;
            } else {
              provider = this._config.fallbackProviders[fallbackIdx];
              ipfs = createIpfsClient(provider);
            }
          } else {
            complete = true;
          }
        }

        if (!result) {
          throw Error(
            `${operation}: Timeout has been exceeded, and all providers have been exhausted.\nTimeout: ${timeout}\nProviders: ${
              providerOverride
                ? [providerOverride]
                : [
                    this._config.provider,
                    ...(this._config.fallbackProviders || []),
                  ]
            }`
          );
        }

        return result;
      } else if (providerOverride) {
        const ipfs = createIpfsClient(providerOverride);
        return exec(ipfs, providerOverride, undefined);
      }
    }

    // Default behavior
    return exec(this._ipfs, this._config.provider, undefined);
  }
}

export const ipfsPlugin: PluginFactory<IpfsConfig> = (opts: IpfsConfig) => {
  return {
    factory: () => new IpfsPlugin(opts),
    manifest: manifest,
  };
};
export const plugin = ipfsPlugin;
