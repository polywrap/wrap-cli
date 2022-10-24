import { ExecOptions } from "./ExecOptions";
import { Ipfs_Options, Env } from "./wrap";

export function getExecOptions(
  args: Ipfs_Options | undefined | null,
  env: Env
): ExecOptions {
  const defaultOptions: ExecOptions = {
    disableParallelRequests: env.disableParallelRequests ?? false,
    timeout: env.timeout ?? 5000,
    provider: env.provider,
    fallbackProviders: env.fallbackProviders ?? [],
  };

  return {
    disableParallelRequests:
      args?.disableParallelRequests ?? defaultOptions.disableParallelRequests,
    timeout: args?.timeout ?? defaultOptions.timeout,
    provider: args?.provider ?? defaultOptions.provider,
    fallbackProviders:
      args?.fallbackProviders ?
        [...args.fallbackProviders, ...defaultOptions.fallbackProviders] :
        defaultOptions.fallbackProviders,
  };
}
