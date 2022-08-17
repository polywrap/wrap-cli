import { ClientConfig, Uri } from ".";
import { IUriResolutionResponse } from "../uri-resolution";

/** Options required for an URI resolution. */
export interface TryResolveToWrapperOptions<
  TUri extends Uri | string,
  TClientConfig extends ClientConfig = ClientConfig
> {
  /** The Wrapper's URI */
  uri: TUri;

  /**
   * If set to true, the resolveUri function will not use the cache to resolve the uri.
   */
  noCacheRead?: boolean;

  /**
   * If set to true, the resolveUri function will not cache the results
   */
  noCacheWrite?: boolean;

  /**
   * If set to true, the resolveUri function will not cache the results
   */
  history?: UriResolutionHistoryType;

  /**
   * Override the client's config for all resolutions.
   */
  config?: Partial<TClientConfig>;

  /**
   * Id used to track context data set internally.
   */
  contextId?: string;
}

export interface UriResolverHandler {
  tryResolveToWrapper<TUri extends Uri | string>(
    options?: TryResolveToWrapperOptions<TUri, ClientConfig>
  ): Promise<IUriResolutionResponse<unknown>>;
}

export enum UriResolutionHistoryType {
  Path,
  Full,
}
