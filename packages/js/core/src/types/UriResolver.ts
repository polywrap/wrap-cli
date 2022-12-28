import { Uri } from ".";
import { IUriResolutionContext, UriPackageOrWrapper } from "../uri-resolution";

import { Result } from "@polywrap/result";

// $start: UriResolver.ts

/** Options required for URI resolution. */
export interface TryResolveUriOptions<TUri extends Uri | string> {
  /** The Wrapper's URI */
  uri: TUri;

  /** A URI resolution context */
  resolutionContext?: IUriResolutionContext;
}

/** An entity capable of resolving a WRAP URI  */
export interface UriResolverHandler<TError = undefined> {
  /**
   * Resolve a URI to a wrap package, a wrapper, or a uri
   *
   * @param options - TryResolveUriOptions
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  tryResolveUri<TUri extends Uri | string>(
    options?: TryResolveUriOptions<TUri>
  ): Promise<Result<UriPackageOrWrapper, TError>>;
}

// $end
