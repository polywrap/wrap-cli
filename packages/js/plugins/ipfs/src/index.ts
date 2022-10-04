import {
  Module,
  Args_resolve,
  Args_addFile,
  Args_cat,
  Ipfs_ResolveResult,
  Ipfs_Options,
  manifest,
  Env,
} from "./wrap";
import { execSimple, execFallbacks } from "./utils/exec";

import { Client, PluginFactory } from "@polywrap/core-js";
import createIpfsClient, {
  IpfsClient,
  IpfsFileInfo,
} from "@polywrap/ipfs-http-client-lite";

export { createIpfsClient, IpfsClient, IpfsFileInfo };

const isNullOrUndefined = (arg: unknown) => {
  return arg === undefined || arg === null;
};

const getOptions = (
  args: Ipfs_Options | undefined | null,
  env: Env
): Ipfs_Options => {
  const options = args || {};

  if (isNullOrUndefined(options.disableParallelRequests)) {
    options.disableParallelRequests = env.disableParallelRequests;
  }

  if (isNullOrUndefined(options.timeout)) {
    // Default to a 5000ms timeout when none is provided
    options.timeout = env.timeout ?? 5000;
  }

  if (isNullOrUndefined(options.provider)) {
    options.provider = env.provider;
  }

  if (isNullOrUndefined(options.fallbackProviders)) {
    options.fallbackProviders = env.fallbackProviders;
  }

  return options;
};

export type NoConfig = Record<string, never>;

export class IpfsPlugin extends Module<NoConfig> {
  public async cat(args: Args_cat, _client: Client): Promise<Buffer> {
    const options = getOptions(args.options, this.env);

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
    const options = getOptions(null, this.env);

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
    const defaultIpfsClient = createIpfsClient(this.env.provider);

    if (!options) {
      // Default behavior if no options are provided
      return await execSimple(
        operation,
        defaultIpfsClient,
        this.config.provider,
        0,
        func
      );
    }

    const timeout = options.timeout || 0;

    let providers = [this.env.provider, ...(this.env.fallbackProviders || [])];
    let ipfs = defaultIpfsClient;
    let defaultProvider = this.env.provider;

    // Use the provider default override specified
    if (options.provider) {
      providers = [options.provider, ...providers];
      ipfs = createIpfsClient(options.provider);
      defaultProvider = options.provider;
    }

    // insert fallback providers before the env providers and fallbacks
    if (options.fallbackProviders) {
      providers = [
        providers[0],
        ...options.fallbackProviders,
        ...providers.slice(1),
      ];
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

export const ipfsPlugin: PluginFactory<NoConfig> = (config: NoConfig) => {
  return {
    factory: () => new IpfsPlugin(config),
    manifest,
  };
};

export const plugin = ipfsPlugin;
