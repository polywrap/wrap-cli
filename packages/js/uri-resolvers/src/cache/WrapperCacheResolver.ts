import { IWrapperCache } from "./IWrapperCache";
import { UriResolutionResult, UriResolver, UriResolverLike } from "../helpers";

import {
  IUriResolver,
  Uri,
  CoreClient,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

// $start: WrapperCacheResolver
/**
 * An IUriResolver implementation that caches wrappers once they are resolved.
 * It does not cache URIs and packages.
 * The WrapperCacheResolver wraps an IUriResolver implementation and delegates resolution to it.
 * */
export class WrapperCacheResolver<TError>
  implements IUriResolver<TError | Error> /* $ */ {
  // $start: WrapperCacheResolver-constructor
  /**
   * Creates a WrapperCacheResolvers
   *
   * @param _resolverToCache - a resolver to delegate resolution to
   * @param _cache - a wrapper cache
   * */
  constructor(
    private _resolverToCache: IUriResolver<TError>,
    private _cache: IWrapperCache
  ) /* $ */ {}

  // $start: WrapperCacheResolver-from
  /**
   * Creates a WrapperCacheResolver from a resolver-like object
   *
   * @param resolver - a resolver-like item to delegate resolution to
   * @param cache - a wrapper cache
   * @param options - control wrapper manifest deserialization
   *
   * @returns a WrapperCacheResolver
   * */
  static from<TResolverError = unknown>(
    resolver: UriResolverLike,
    cache: IWrapperCache,
  ): WrapperCacheResolver<TResolverError> /* $ */ {
    return new WrapperCacheResolver(
      UriResolver.from<TResolverError>(resolver),
      cache
    );
  }

  // $start: WrapperCacheResolver-tryResolveUri
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
    const wrapper = await this._cache.get(uri);

    // Return from cache if available
    if (wrapper) {
      const result = UriResolutionResult.ok(uri, wrapper);

      resolutionContext.trackStep({
        sourceUri: uri,
        result,
        description: "WrapperCacheResolver (Cache)",
      });
      return result;
    }

    // Resolve uri if not in cache
    const subContext = resolutionContext.createSubHistoryContext();

    const result = await this._resolverToCache.tryResolveUri(
      uri,
      client,
      subContext
    );

    console.log("RESULT", result);
    if (result.ok && result.value.type === "wrapper") {
      const wrapper = result.value.wrapper;
      const resolutionPath: Uri[] = subContext.getResolutionPath();

      console.log("RESOLUTION PATH", subContext, result.value.uri.uri);
      for (const uri of resolutionPath) {
        await this._cache.set(uri, wrapper);
      }

      await this._cache.set(result.value.uri, wrapper);
    }

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      subHistory: subContext.getHistory(),
      description: "WrapperCacheResolver",
    });
    return result;
  }
}
