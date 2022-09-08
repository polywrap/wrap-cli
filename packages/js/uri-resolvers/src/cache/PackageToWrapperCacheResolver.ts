import { UriResolverLike } from "../UriResolverLike";
import { buildUriResolver } from "../buildUriResolver";

import {
  IUriResolver,
  Uri,
  Client,
  IUriResolutionStep,
  IUriResolutionResponse,
  executeMaybeAsyncFunction,
  Wrapper,
  UriResolutionResponse,
} from "@polywrap/core-js";
import { IWrapperCache } from "./IWrapperCache";
import { DeserializeManifestOptions } from "@polywrap/wrap-manifest-types-js";
import { getUriHistory } from "../getUriHistory";
import { InfiniteLoopError } from "../InfiniteLoopError";
import { fullyResolveUri } from "../aggregator";

export class PackageToWrapperCacheResolver<TError = undefined>
  implements IUriResolver<TError | InfiniteLoopError> {
  name: string;
  resolverToCache: IUriResolver<TError>;

  constructor(
    private cache: IWrapperCache,
    resolverToCache: UriResolverLike,
    private options?: {
      deserializeManifestOptions?: DeserializeManifestOptions;
      resolverName?: string;
      endOnRedirect?: boolean;
    }
  ) {
    if (options?.resolverName) {
      this.name = options.resolverName;
    } else {
      this.name = "PackageToWrapperCacheResolver";
    }

    this.resolverToCache = buildUriResolver(resolverToCache);
  }

  async tryResolveUri(
    uri: Uri,
    client: Client
  ): Promise<IUriResolutionResponse<TError | InfiniteLoopError>> {
    return this.options?.endOnRedirect
      ? this.resolveUriOnce(client, uri, uri, [])
      : await fullyResolveUri(uri, (currentUri, history) => {
          return this.resolveUriOnce(client, uri, currentUri, history);
        });
  }

  protected async resolveUriOnce(
    client: Client,
    uri: Uri,
    currentUri: Uri,
    history: IUriResolutionStep<unknown>[]
  ): Promise<IUriResolutionResponse<TError>> {
    const wrapper = await executeMaybeAsyncFunction<Wrapper | undefined>(
      this.cache.get.bind(this.cache, currentUri)
    );

    if (wrapper) {
      const response = UriResolutionResponse.ok(wrapper);

      history.push({
        resolverName: `${this.name} (cache)`,
        sourceUri: currentUri,
        response,
      });

      return UriResolutionResponse.ok(wrapper, history);
    }

    const response = await this.resolverToCache.tryResolveUri(
      currentUri,
      client
    );

    if (response.result.ok) {
      const uriPackageOrWrapper = response.result.value;

      if (uriPackageOrWrapper.type === "wrapper") {
        history.push({
          resolverName: this.name,
          sourceUri: currentUri,
          response,
        });

        const uriHistory: Uri[] = [uri, ...getUriHistory(history)];

        for (const uri of uriHistory) {
          await executeMaybeAsyncFunction<Wrapper | undefined>(
            this.cache.set.bind(this.cache, uri, uriPackageOrWrapper.wrapper)
          );
        }

        return UriResolutionResponse.ok(uriPackageOrWrapper.wrapper, history);
      } else if (uriPackageOrWrapper.type === "package") {
        const uriHistory: Uri[] = [uri, ...getUriHistory(history)];

        const wrapper = await uriPackageOrWrapper.package.createWrapper(
          client,
          uriHistory,
          { noValidate: this.options?.deserializeManifestOptions?.noValidate }
        );

        for (const uri of uriHistory) {
          await executeMaybeAsyncFunction<Wrapper | undefined>(
            this.cache.set.bind(this.cache, uri, wrapper)
          );
        }

        history.push({
          resolverName: this.name,
          sourceUri: currentUri,
          response: UriResolutionResponse.ok(wrapper, response.history),
        });

        return UriResolutionResponse.ok(wrapper, history);
      } else {
        const resultUri = uriPackageOrWrapper.uri;

        history.push({
          resolverName: this.name,
          sourceUri: currentUri,
          response,
        });

        return UriResolutionResponse.ok(resultUri, history);
      }
    } else {
      history.push({
        resolverName: this.name,
        sourceUri: currentUri,
        response,
      });

      return UriResolutionResponse.err(response.result.error, history);
    }
  }
}
