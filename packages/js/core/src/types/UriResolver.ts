import { Result } from "@polywrap/result";
import { ClientConfig, Uri } from ".";
import { IUriResolutionContext, UriPackageOrWrapper } from "../uri-resolution";

/** Options required for an URI resolution. */
export interface TryResolveUriOptions<
  TUri extends Uri | string,
  TClientConfig extends ClientConfig = ClientConfig
> {
  /** The Wrapper's URI */
  uri: TUri;

  resolutionContext?: IUriResolutionContext;

  /**
   * Override the client's config for all resolutions.
   */
  config?: Partial<TClientConfig>;

  /**
   * Id used to track context data set internally.
   */
  contextId?: string;
}

export interface UriResolverHandler<TError = undefined> {
  tryResolveUri<TUri extends Uri | string>(
    options?: TryResolveUriOptions<TUri, ClientConfig>
  ): Promise<Result<UriPackageOrWrapper, TError>>;
}
