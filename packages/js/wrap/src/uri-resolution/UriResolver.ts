import { Uri, UriResolutionContext, UriPackageOrWrapper } from ".";
import { WrapClient } from "../client";

import { Result } from "@polywrap/result";

// $start: UriResolver
/** Defines entity capable of resolving a wrap URI */
export interface UriResolver<TError = undefined> {
  /**
   * Resolve a URI to a wrap package, a wrapper, or a uri
   *
   * @param uri - the URI to resolve
   * @param client - a WrapClient instance that may be used to invoke a wrapper that implements the UriResolver interface
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  tryResolveUri(
    uri: Uri,
    client: WrapClient,
    resolutionContext: UriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>>;
}
// $end
