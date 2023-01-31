import { IWrapperCache } from "./IWrapperCache";
import { UriResolver, UriResolutionResult, UriResolverLike } from "../helpers";

import {
  IUriResolver,
  Uri,
  CoreClient,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { DeserializeManifestOptions } from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";

// $start: PackageToWrapperCacheResolver
/**
 * An IUriResolver implementation that caches wrappers once they are resolved.
 * The PackageToWrapeprCacheResolver wraps one or more IUriResolver
 * implementations and delegates resolution to them.
 * */
export class PackageToWrapperCacheResolver<TError>
  implements IUriResolver<TError | Error> /* $ */ {
  // TODO: the name property is never assigned
  name: string;

  // $start: PackageToWrapperCacheResolver-constructor
  /**
   * Create a PackageToWrapperCacheResolver
   *
   * @param _resolverToCache - a resolver to delegate resolution to
   * @param _cache - a wrapper cache
   * @param _options - control wrapper manifest deserialization
   * */
  constructor(
    private _resolverToCache: IUriResolver<TError>,
    private _cache: IWrapperCache,
    private _options?: {
      deserializeManifestOptions?: DeserializeManifestOptions;
      endOnRedirect?: boolean;
    }
  ) /* $ */ {}

  // $start: PackageToWrapperCacheResolver-from
  /**
   * Create a PackageToWrapperCacheResolver from a resolver-like object
   *
   * @param resolver - a resolver-like item to delegate resolution to
   * @param cache - a wrapper cache
   * @param options - control wrapper manifest deserialization
   *
   * @returns a PackageToWrapperCacheResolver
   * */
  static from<TResolverError = unknown>(
    resolver: UriResolverLike,
    cache: IWrapperCache,
    options?: {
      deserializeManifestOptions?: DeserializeManifestOptions;
      endOnRedirect?: boolean;
    }
  ): PackageToWrapperCacheResolver<TResolverError> /* $ */ {
    return new PackageToWrapperCacheResolver(
      UriResolver.from<TResolverError>(resolver),
      cache,
      options
    );
  }

  // $start: PackageToWrapperCacheResolver-tryResolveUri
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

    if (wrapper) {
      const result = UriResolutionResult.ok(uri, wrapper);

      resolutionContext.trackStep({
        sourceUri: uri,
        result,
        description: "PackageToWrapperCacheResolver (Cache)",
      });
      return result;
    }

    const subContext = resolutionContext.createSubHistoryContext();

    let result = await this._resolverToCache.tryResolveUri(
      uri,
      client,
      subContext
    );

    if (result.ok) {
      if (result.value.type === "package") {
        const wrapPackage = result.value.package;
        const resolutionPath: Uri[] = subContext.getResolutionPath();

        const createResult = await wrapPackage.createWrapper({
          noValidate: this._options?.deserializeManifestOptions?.noValidate,
        });

        if (!createResult.ok) {
          return createResult;
        }

        const wrapper = createResult.value;

        for (const uri of resolutionPath) {
          await this._cache.set(uri, wrapper);
        }

        result = UriResolutionResult.ok(result.value.uri, wrapper);
      } else if (result.value.type === "wrapper") {
        const wrapper = result.value.wrapper;
        const resolutionPath: Uri[] = subContext.getResolutionPath();

        for (const uri of resolutionPath) {
          await this._cache.set(uri, wrapper);
        }
      }
    }

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      subHistory: subContext.getHistory(),
      description: "PackageToWrapperCacheResolver",
    });
    return result;
  }
}
