import { InfiniteLoopError } from "./InfiniteLoopError";
import { UriResolverLike } from "./UriResolverLike";
import { UriResolutionResult } from "./UriResolutionResult";
import { UriResolverFactory } from "./UriResolverFactory";

import {
  UriResolver,
  Uri,
  WrapClient,
  UriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/wrap-js";
import { Result } from "@polywrap/result";

// $start: ResolverWithLoopGuard
/** An IUriResolver implementation that prevents infinite loops in the resolution path. */
export class ResolverWithLoopGuard<TError = undefined>
  implements UriResolver<TError | InfiniteLoopError> /* $ */ {
  // $start: ResolverWithLoopGuard-constructor
  /**
   * Construct a ResolverWithLoopGuard
   *
   * @param _resolver - a resolution to delegate resolution to
   * */
  constructor(private _resolver: UriResolver<TError>) /* $ */ {}

  // $start: ResolverWithLoopGuard-from
  /**
   * Create a ResolverWithLoopGuard from a resolver-like object
   *
   * @param resolver - a resolver-like item to delegate resolution to
   *
   * @returns a ResolverWithLoopGuard
   * */
  static from<TResolverError = unknown>(
    resolver: UriResolverLike
  ): ResolverWithLoopGuard<TResolverError> /* $ */ {
    return new ResolverWithLoopGuard(
      UriResolverFactory.from<TResolverError>(resolver)
    );
  }

  // $start: ResolverWithLoopGuard-tryResolveUri
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * Ensures the URI is not caught in an infinite loop by checking if it is already resolving.
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that may be used to invoke a wrapper that implements the UriResolver interface
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  async tryResolveUri(
    uri: Uri,
    client: WrapClient,
    resolutionContext: UriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | InfiniteLoopError>> /* $ */ {
    if (resolutionContext.isResolving(uri)) {
      return UriResolutionResult.err(
        new InfiniteLoopError(uri, resolutionContext.getHistory())
      );
    }

    resolutionContext.startResolving(uri);

    const result = await this._resolver.tryResolveUri(
      uri,
      client,
      resolutionContext
    );

    resolutionContext.stopResolving(uri);

    return result;
  }
}
