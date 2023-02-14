import { UriResolver, UriResolverLike } from "../helpers";

import {
  IUriResolver,
  Uri,
  CoreClient,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

/* Uri resolver that synchronizes requests to the same URI
* Multiple requests to the same URI will be resolved only once
* and the result will be cached for subsequent requests (only for the duration of that first request)
* Can use the `shouldIgnoreCache` option to determine whether to ignore the cached request in case of an error
* (default is to use the cache)
*/
export class RequestSynchronizerResolver<TError>
  implements IUriResolver<TError> {
  private requestCache: Map<
    string,
    Promise<Result<UriPackageOrWrapper, TError>>
  > = new Map();

  /**
   * Construct a RequestSynchronizerResolver
   *
   * @param resolverToSynchronize - the inner resolve whose resolution will be synchronized
   * @param options - the optional options containing the `shouldIgnoreCache` error handler
   * */
  constructor(
    private resolverToSynchronize: IUriResolver<TError>,
    private options?: {
      shouldIgnoreCache?: (error: TError | undefined) => boolean;
    }
  ) {}

  /**
   * Create a RequestSynchronizerResolver from a static-resolver-like object
   *
   * @param resolver - a resolver-like object whose resolution will be synchronized
   * @param options - the optional options containing the `shouldIgnoreCache` error handler
   *
   * @returns a RequestSynchronizerResolver
   * */
  static from<TResolverError = unknown>(
    resolver: UriResolverLike,
    options?: {
      shouldIgnoreCache?: (error: TResolverError | undefined) => boolean;
    }
  ): RequestSynchronizerResolver<TResolverError> {
    return new RequestSynchronizerResolver(
      UriResolver.from<TResolverError>(resolver),
      options
    );
  }

  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * Attempts to resolve the URI using each of the aggregated resolvers sequentially.
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
  ): Promise<Result<UriPackageOrWrapper, TError>> {
    const subContext = resolutionContext.createSubHistoryContext();

    const existingRequest = this.requestCache.get(uri.uri);

    if (existingRequest) {
      return existingRequest.then(
        (result) => {
          // In case of an error and the shouldIgnoreCache error handler returns true, we try to resolve the URI again.
          if (
            !result.ok &&
            this.options?.shouldIgnoreCache &&
            this.options.shouldIgnoreCache(result.error)
          ) {
            return this.tryResolveUri(uri, client, subContext).then(
              trackStep(uri, resolutionContext, subContext)
            );
          }

          // Otherwise, we use the cached result.
          resolutionContext.trackStep({
            sourceUri: uri,
            result,
            description: "RequestSynchronizerResolver (Cache)",
          });

          return result;
        },
        (error: unknown) => {
          // In case of a promise error (not a resolution one) we throw for all of the listeners
          throw error;
        }
      );
    }

    return this.resolveAndCacheRequest(uri, client, subContext).then(
      trackStep(uri, resolutionContext, subContext)
    );
  }

  /**
   * A function that resolves a URI and caches the promise of that resolution for subsequent requests
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that may be used to invoke a wrapper that implements the UriResolver interface
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   * */
  private resolveAndCacheRequest(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>> {
    const resolutionRequest = new Promise<Result<UriPackageOrWrapper, TError>>(
      (resolve, reject) => {
        this.resolverToSynchronize
          .tryResolveUri(uri, client, resolutionContext)
          .then(
            (data) => {
              // Delete from cache before resolve, so that retries don't get the same promise (that ended)
              this.requestCache.delete(uri.uri);
              resolve(data);
            },
            (error) => {
              // Delete from cache before reject, so that retries don't get the same promise (that ended)
              this.requestCache.delete(uri.uri);
              reject(error);
            }
          );
      }
    );

    this.requestCache.set(uri.uri, resolutionRequest);

    return resolutionRequest;
  }
}

const trackStep = (
  uri: Uri,
  resolutionContext: IUriResolutionContext,
  subContext: IUriResolutionContext
) => <TError>(result: Result<UriPackageOrWrapper, TError>) => {
  resolutionContext.trackStep({
    sourceUri: uri,
    result,
    subHistory: subContext.getHistory(),
    description: "RequestSynchronizerResolver",
  });

  return result;
};
