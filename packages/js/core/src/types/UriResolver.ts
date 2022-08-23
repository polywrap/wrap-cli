import { ClientConfig, Uri } from ".";
import { IUriResolutionResponse } from "../uri-resolution";

/** Options required for an URI resolution. */
export interface TryResolveUriOptions<
  TUri extends Uri | string,
  TClientConfig extends ClientConfig = ClientConfig
> {
  /** The Wrapper's URI */
  uri: TUri;

  /**
   * If set to true, the resolveUri function will not cache the results
   */
  history: "none" | "path" | "full";

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
  tryResolveUri<TUri extends Uri | string>(
    options?: TryResolveUriOptions<TUri, ClientConfig>
  ): Promise<IUriResolutionResponse<unknown>>;
}
