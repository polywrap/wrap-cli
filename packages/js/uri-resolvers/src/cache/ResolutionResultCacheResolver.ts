import { IResolutionResultCache } from "./IResolutionResultCache";
import { UriResolver, UriResolverLike } from "../helpers";

import {
  IUriResolver,
  Uri,
  CoreClient,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

// $start: ResolutionResultCacheResolver
/**
 * An IUriResolver implementation that caches the URI resolution result.
 * The URI resolution result can be a URI, IWrapPackage, Wrapper or Error.
 * Errors are not cached by default and can be cached by setting the cacheErrors option to true.
 * The ResolutionResultCacheResolver wraps an IUriResolver implementation and delegates resolution to it.
 * */
export class ResolutionResultCacheResolver<TError>
  implements IUriResolver<TError | Error> /* $ */ {
  // $start: ResolutionResultCacheResolver-constructor
  /**
   * Creates a ResolutionResultCacheResolver
   *
   * @param _innerResolver - a resolver to delegate resolution to
   * @param _cache - a resolution result cache
   * @param options - cacheErrors (default: false)
   * */
  constructor(
    private _innerResolver: IUriResolver<TError>,
    private _cache: IResolutionResultCache<TError>,
    private _options: { cacheErrors: boolean } = { cacheErrors: false }
  ) /* $ */ {}

  // $start: ResolutionResultCacheResolver-from
  /**
   * Creates a ResolutionResultCacheResolver from a resolver-like object
   *
   * @param innerResolver - a resolver-like item to delegate resolution to
   * @param cache - a resolution result cache
   * @param options - cacheErrors (default: false)
   *
   * @returns a ResolutionResultCacheResolver
   * */
  static from<TResolverError = unknown>(
    innerResolver: UriResolverLike,
    cache: IResolutionResultCache<TResolverError>,
    options: { cacheErrors: boolean } = { cacheErrors: false }
  ): ResolutionResultCacheResolver<TResolverError> /* $ */ {
    return new ResolutionResultCacheResolver(
      UriResolver.from<TResolverError>(innerResolver),
      cache,
      options
    );
  }

  // $start: ResolutionResultCacheResolver-tryResolveUri
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * If successful, cache the result.
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
  ): Promise<Result<UriPackageOrWrapper, TError | Error>> /* $ */ {
    const cachedResult = await this._cache.get(uri);

    // Return from cache if available
    if (cachedResult) {
      resolutionContext.trackStep({
        sourceUri: uri,
        result: cachedResult,
        description: "ResolutionResultCacheResolver (Cache)",
      });
      return cachedResult;
    }

    // Resolve URI if not in cache
    const subContext = resolutionContext.createSubHistoryContext();

    const result = await this._innerResolver.tryResolveUri(
      uri,
      client,
      subContext
    );

    if (result.ok || this._options.cacheErrors) {
      await this._cache.set(uri, result);
    }

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      subHistory: subContext.getHistory(),
      description: "ResolutionResultCacheResolver",
    });
    return result;
  }
}
