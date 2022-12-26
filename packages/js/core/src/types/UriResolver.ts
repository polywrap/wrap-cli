import { Uri } from ".";
import { IUriResolutionContext, UriPackageOrWrapper } from "../uri-resolution";

import { Result } from "@polywrap/result";

/** Options required for an URI resolution. */
export interface TryResolveUriOptions {
  /** The Wrapper's URI */
  uri: Uri;

  resolutionContext?: IUriResolutionContext;
}

export interface UriResolverHandler<TError = undefined> {
  tryResolveUri(
    options?: TryResolveUriOptions
  ): Promise<Result<UriPackageOrWrapper, TError>>;
}
