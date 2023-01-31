import { InfiniteLoopError } from "./InfiniteLoopError";
import { UriResolverLike } from "./UriResolverLike";
import { UriResolutionResult } from "./UriResolutionResult";
import { UriResolver } from "./UriResolver";

import {
  IUriResolver,
  Uri,
  CoreClient,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

/** An IUriResolver implementation that prevents infinite loops in the resolution path. */
export class ResolverWithLoopGuard<TError = undefined>
  implements IUriResolver<TError | InfiniteLoopError> {
  /**
   * Construct a ResolverWithLoopGuard
   *
   * @param _resolver - a resolution to delegate resolution to
   * */
  constructor(private _resolver: IUriResolver<TError>) {}

  /**
   * Create a ResolverWithLoopGuard from a resolver-like object
   *
   * @param resolver - a resolver-like item to delegate resolution to
   *
   * @returns a ResolverWithLoopGuard
   * */
  static from<TResolverError = unknown>(
    resolver: UriResolverLike
  ): ResolverWithLoopGuard<TResolverError> {
    return new ResolverWithLoopGuard(
      UriResolver.from<TResolverError>(resolver)
    );
  }

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
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | InfiniteLoopError>> {
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
