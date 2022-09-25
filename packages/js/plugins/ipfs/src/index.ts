import {
  Module,
  Args_resolve,
  Args_addFile,
  Args_cat,
  Ipfs_Options,
  Ipfs_ResolveResult,
  Env,
  manifest,
} from "./wrap";
import { IpfsClient } from "./utils/IpfsClient";
import { execSimple, execFallbacks } from "./utils/exec";

import { Client } from "@polywrap/core-js";
import { PluginFactory, PluginPackage } from "@polywrap/plugin-js";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/naming-convention
const createIpfsClient = require("@dorgjelli-test/ipfs-http-client-lite");

const getOptions = (
  args: Ipfs_Options | undefined | null,
  env: Env
): Ipfs_Options => {
  const options = args || {};

  if (
    options.disableParallelRequests === undefined ||
    options.disableParallelRequests === null
  ) {
    options.disableParallelRequests = env.disableParallelRequests;
  }

  return options;
};

export interface IpfsPluginConfig {
  provider: string;
  fallbackProviders?: string[];
}

export class IpfsPlugin extends Module<IpfsPluginConfig> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: initialized within setProvider
  private _ipfs: IpfsClient;

  constructor(config: IpfsPluginConfig) {
    super(config);
    this._ipfs = createIpfsClient(this.config.provider);
  }

  public async cat(args: Args_cat, _client: Client): Promise<Buffer> {
    return await this._execWithOptions(
      "cat",
      (ipfs: IpfsClient, _provider: string, options: unknown) => {
        return ipfs.cat(args.cid, options);
      },
      args.options ?? undefined
    );
  }

  public async resolve(
    args: Args_resolve,
    _client: Client
  ): Promise<Ipfs_ResolveResult | null> {
    const options = getOptions(args.options, this.env);
    return await this._execWithOptions(
      "resolve",
      async (ipfs: IpfsClient, provider: string, options: unknown) => {
        const { path } = await ipfs.resolve(args.cid, options);
        return {
          cid: path,
          provider,
        };
      },
      options
    );
  }

  public async addFile(args: Args_addFile): Promise<string> {
    const result = await this._ipfs.add(new Uint8Array(args.data));

    if (result.length === 0) {
      throw Error(
        `IpfsPlugin:add failed to add contents. Result of length 0 returned.`
      );
    }

    return result[0].hash.toString();
  }

  private async _execWithOptions<TReturn>(
    operation: string,
    func: (
      ipfs: IpfsClient,
      provider: string,
      options: unknown
    ) => Promise<TReturn>,
    options?: Ipfs_Options
  ): Promise<TReturn> {
    if (!options) {
      // Default behavior if no options are provided
      return await execSimple(
        operation,
        this._ipfs,
        this.config.provider,
        0,
        func
      );
    }

    const timeout = options.timeout || 0;

    let providers = [
      this.config.provider,
      ...(this.config.fallbackProviders || []),
    ];
    let ipfs = this._ipfs;
    let defaultProvider = this.config.provider;

    // Use the provider default override specified
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

export const ipfsPlugin: PluginFactory<IpfsPluginConfig> = (
  config: IpfsPluginConfig
) => new PluginPackage(new IpfsPlugin(config), manifest);

export const plugin = ipfsPlugin;
