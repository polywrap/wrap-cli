import {
  Module,
  Args_resolve,
  Args_addFile,
  Args_cat,
  Ipfs_Options,
  Ipfs_ResolveResult,
  manifest,
} from "./wrap";
import { IpfsClient } from "./utils/IpfsClient";
import { execSimple, execFallbacks } from "./utils/exec";

import { Client, PluginFactory } from "@polywrap/core-js";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/naming-convention
const createIpfsClient = require("@dorgjelli-test/ipfs-http-client-lite");

const isNullOrUndefined = (arg: unknown) => {
  return arg === undefined || arg === null;
};

const getOptions = (
  args: Ipfs_Options | undefined | null,
  timeout: number | null | undefined,
  disableParallelRequests: boolean | null | undefined,
  provider: string | null | undefined
): Ipfs_Options => {
  const options = args || {};

  if (isNullOrUndefined(options.disableParallelRequests)) {
    options.disableParallelRequests = disableParallelRequests;
  }

  if (isNullOrUndefined(options.timeout)) {
    options.timeout = timeout;
  }
  
  if (isNullOrUndefined(options.provider)) {
    options.provider = provider;
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
    const options = getOptions(
      args.options,
      this.env.timeouts?.cat,
      this.env.disableParallelRequests,
      this.env.provider
    );

    return await this._execWithOptions(
      "cat",
      (ipfs: IpfsClient, _provider: string, options: unknown) => {
        return ipfs.cat(args.cid, options);
      },
      options
    );
  }

  public async resolve(
    args: Args_resolve,
    _client: Client
  ): Promise<Ipfs_ResolveResult | null> {
    const options = getOptions(
      args.options,
      this.env.timeouts?.resolve,
      this.env.disableParallelRequests,
      this.env.provider
    );
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
    const options = getOptions(
      null,
      this.env.timeouts?.addFile,
      this.env.disableParallelRequests,
      this.env.provider
    );

    return await this._execWithOptions(
      "add",
      async (ipfs: IpfsClient, provider: string, options: unknown) => {
        const result = await ipfs.add(new Uint8Array(args.data), options);

        if (result.length === 0) {
          throw Error(
            `IpfsPlugin:add failed to add contents. Result of length 0 returned.`
          );
        }

        return result[0].hash.toString();
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
) => {
  return {
    factory: () => new IpfsPlugin(config),
    manifest,
  };
};

export const plugin = ipfsPlugin;
