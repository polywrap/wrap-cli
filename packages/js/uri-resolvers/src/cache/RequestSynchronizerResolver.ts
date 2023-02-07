import { UriResolver, UriResolverLike } from "../helpers";

import {
  IUriResolver,
  Uri,
  CoreClient,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export class RequestSynchronizerResolver<TError>
  implements IUriResolver<TError | Error> {
  private requestCache: Map<
    string,
    Promise<Result<UriPackageOrWrapper, TError | Error>>
  > = new Map();

  constructor(private resolverToSynchronize: IUriResolver<TError>) {}

  static from<TResolverError = unknown>(
    resolver: UriResolverLike
  ): RequestSynchronizerResolver<TResolverError> {
    return new RequestSynchronizerResolver(
      UriResolver.from<TResolverError>(resolver)
    );
  }

  async tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | Error>> {
    const existingRequest = this.requestCache.get(uri.uri);

    if (existingRequest) {
      return existingRequest.then(
        (result) => {
          resolutionContext.trackStep({
            sourceUri: uri,
            result,
            description: "RequestSynchronizerResolver (Cache)",
          });

          return result;
        },
        () => {
          // In case of an error, we try to resolve the URI again.
          // This is because the error might be caused by a network issue or something similar,
          // and we don't want all the requests to fail.
          return this.tryResolveUri(uri, client, resolutionContext);
        }
      );
    }

    return this.resolveAndCacheRequest(uri, client, resolutionContext);
  }

  resolveAndCacheRequest(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | Error>> {
    const resolutionRequest = new Promise<
      Result<UriPackageOrWrapper, TError | Error>
    >((resolve, reject) => {
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
    });

    this.requestCache.set(uri.uri, resolutionRequest);

    return resolutionRequest;
  }
}
