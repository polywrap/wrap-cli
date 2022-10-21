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

import { Client } from "@polywrap/core-js";
import createIpfsClient, { IpfsClient } from "@polywrap/ipfs-http-client-lite";
import { PluginFactory, PluginPackage } from "@polywrap/plugin-js";
import { ExecOptions } from "./ExecOptions";

const isNullOrUndefined = (arg: unknown) => {
  return arg === undefined || arg === null;
};

const getExecOptions = (
  args: Ipfs_Options | undefined | null,
  env: Env
): ExecOptions => {
  const options = args || {};

  if (isNullOrUndefined(options.disableParallelRequests)) {
    options.disableParallelRequests = !!env.disableParallelRequests;
  }

  if (isNullOrUndefined(options.timeout)) {
    // Default to a 5000ms timeout when none is provided
    options.timeout = env.timeout ?? 5000;
  }

  if (isNullOrUndefined(options.provider)) {
    options.provider = env.provider;
  }

  if (isNullOrUndefined(options.fallbackProviders)) {
    options.fallbackProviders = env.fallbackProviders ?? [];
  }

  return options as ExecOptions;
};

export type NoConfig = Record<string, never>;

export class IpfsPlugin extends Module<NoConfig> {
  public async cat(args: Args_cat, _client: Client): Promise<Buffer> {
    const options = getExecOptions(args.options, this.env);

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
    const options = getExecOptions(args.options, this.env);

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
    const options = getExecOptions(null, this.env);

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
    options: ExecOptions
  ): Promise<TReturn> {
    const defaultIpfsClient = createIpfsClient(options.provider);

    if (options.fallbackProviders.length === 0) {
      return await execSimple(
        operation,
        defaultIpfsClient,
        options.provider,
        options.timeout,
        func
      );
    }

    return await execFallbacks(
      operation,
      defaultIpfsClient,
      options.provider,
      [options.provider, ...options.fallbackProviders],
      options.timeout,
      func,
      {
        parallel: !options.disableParallelRequests,
      }
    );
  }
}

export const ipfsPlugin: PluginFactory<NoConfig> = () =>
  new PluginPackage(new IpfsPlugin({}), manifest);

export const plugin = ipfsPlugin;
