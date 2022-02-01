import { query, mutation } from "./resolvers";
import { manifest, Query, Mutation, Options, ResolveResult } from "./w3";
import { IpfsClient } from "./types/IpfsClient";
import { execSimple, execFallbacks } from "./exec";

import {
  Client,
  Plugin,
  PluginFactory,
  PluginPackageManifest,
} from "@web3api/core-js";
import CID from "cids";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const isIPFS = require("is-ipfs");
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/naming-convention
const createIpfsClient = require("@dorgjelli-test/ipfs-http-client-lite");

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
    func: (
      ipfs: IpfsClient,
      provider: string,
      options: unknown
    ) => Promise<TReturn>,
    options?: Options
  ): Promise<TReturn> {
    if (!options) {
      // Default behavior if no options are provided
      return await execSimple(
        operation,
        this._ipfs,
        this._config.provider,
        0,
        func
      );
    }

    const timeout = options.timeout || 0;

    let providers = [
      this._config.provider,
      ...(this._config.fallbackProviders || []),
    ];
    let ipfs = this._ipfs;
    let defaultProvider = this._config.provider;

    // Use the provider defaul toverride specified
    if (options.provider) {
      providers = [options.provider, ...providers];
      ipfs = createIpfsClient(options.provider);
      defaultProvider = options.provider;
    }

    return await execFallbacks(
      operation,
      ipfs,
      defaultProvider,
      providers,
      timeout,
      func,
      {
        parallel: !options.disableParallelRequests,
      }
    );
  }
}

export const ipfsPlugin: PluginFactory<IpfsConfig> = (opts: IpfsConfig) => {
  return {
    factory: () => new IpfsPlugin(opts),
    manifest: manifest,
  };
};
export const plugin = ipfsPlugin;
