import { Uri, CoreClient } from "..";
import { IUriResolutionContext } from "./IUriResolutionContext";
import { UriPackageOrWrapper } from "./UriPackageOrWrapper";

import { Result } from "@polywrap/result";

// $start: IUriResolver
/** Defines entity capable of resolving a wrap URI */
export interface IUriResolver<TError = undefined> {
  /**
   * Resolve a URI to a wrap package, a wrapper, or a uri
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that may be used to invoke a wrapper that implements the UriResolver interface
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>>;
}
// $end
