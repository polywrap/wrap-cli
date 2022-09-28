import { Uri } from ".";
import { IUriResolutionContext, UriPackageOrWrapper } from "../uri-resolution";

import { Result } from "@polywrap/result";

/** Options required for an URI resolution. */
export interface TryResolveUriOptions<TUri extends Uri | string> {
  /** The Wrapper's URI */
  uri: TUri;

  resolutionContext?: IUriResolutionContext;
}

export interface UriResolverHandler<TError = undefined> {
  tryResolveUri<TUri extends Uri | string>(
    options?: TryResolveUriOptions<TUri>
  ): Promise<Result<UriPackageOrWrapper, TError>>;
}
