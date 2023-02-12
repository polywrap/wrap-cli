import { UriResolver, UriResolverLike } from "../helpers";

import {
  IUriResolver,
  Uri,
  CoreClient,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

// Uri resolver that synchronizes requests to the same URI
// Multiple requests to the same URI will be resolved only once
// and the result will be cached for subsequent requests
// Can use the `shouldIgnoreCache` option to determine whether to use the cached request in case of an error
// (default is not to use the cache)
export class RequestSynchronizerResolver<TError>
  implements IUriResolver<TError> {
  private requestCache: Map<
    string,
    Promise<Result<UriPackageOrWrapper, TError>>
  > = new Map();

  constructor(
    private resolverToSynchronize: IUriResolver<TError>,
    private options?: {
      shouldIgnoreCache?: (error: TError | undefined) => boolean;
    }
  ) {}

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

  async tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>> {
    const existingRequest = this.requestCache.get(uri.uri);

    if (existingRequest) {
      return existingRequest.then(
        (result) => {
          console.log(uri.uri, result.ok, !!this.options?.shouldIgnoreCache)
          // In case of an error and the shouldIgnoreCache error handler returns true, we try to resolve the URI again.
          if (
            !result.ok &&
            this.options?.shouldIgnoreCache &&
            this.options.shouldIgnoreCache(result.error)
          ) {
            return this.tryResolveUri(uri, client, resolutionContext);
          }

          // Otherwise, we use the cached result.
          resolutionContext.trackStep({
            sourceUri: uri,
            result: result,
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

    return this.resolveAndCacheRequest(uri, client, resolutionContext);
  }

  resolveAndCacheRequest(
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
              resolve(data);
            },
            (error) => {
              reject(error);
            }
          )
          .finally(() => {
            // After every listener has been notified with the above resolve or reject, remove the request from the cache.
            this.requestCache.delete(uri.uri);
          });
      }
    );

    this.requestCache.set(uri.uri, resolutionRequest);

    return resolutionRequest;
  }
}
