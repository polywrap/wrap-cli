import { Uri } from ".";
import { ResolveUriResult } from "..";

/** Options required for an URI resolution. */
export interface ResolveUriOptions {
  /**
   * If set to true, the resolveUri function will not use the cache to resolve the uri.
   */
  noCacheRead?: boolean;

  /**
   * If set to true, the resolveUri function will not cache the results
   */
  noCacheWrite?: boolean;
}

export interface UriResolverHandler {
  resolveUri<TUri extends Uri | string>(
    uri: TUri,
    options?: ResolveUriOptions
  ): Promise<ResolveUriResult>;

  loadUriResolvers(): Promise<{
    success: boolean;
    failedUriResolvers: string[];
  }>;
}
