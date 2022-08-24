import { ICacheResolver } from "./ICacheResolver";
import { UriResolverLike } from "../UriResolverLike";
import { buildUriResolver } from "../buildUriResolver";

import {
  IUriResolver,
  Uri,
  Client,
  IUriResolutionStep,
  IUriResolutionResponse,
} from "@polywrap/core-js";

export class CacheableResolver<TError = undefined>
  implements IUriResolver<TError> {
  name: string;
  resolverToCache: IUriResolver<TError>;

  constructor(
    public cacheResolver: ICacheResolver<TError>,
    resolverToCache: UriResolverLike,
    name?: string
  ) {
    if (name) {
      this.name = name;
    } else {
      this.name = CacheableResolver.name;
    }

    this.resolverToCache = buildUriResolver(resolverToCache);
  }

  async tryResolveUri(
    uri: Uri,
    client: Client
  ): Promise<IUriResolutionResponse<TError>> {
    const cachedResponse = await this.cacheResolver.tryResolveUri(uri, client);

    const isCacheMiss =
      cachedResponse.result.ok &&
      cachedResponse.result.value.type === "uri" &&
      cachedResponse.result.value.uri === uri;

    if (!isCacheMiss) {
      return {
        result: cachedResponse.result,
        history: [
          {
            resolverName: this.cacheResolver.name,
            sourceUri: uri,
            response: cachedResponse,
          } as IUriResolutionStep<TError>,
        ],
      };
    }

    const response = await this.resolverToCache.tryResolveUri(uri, client);

    const endResponse = await this.cacheResolver.onResolutionEnd(
      uri,
      client,
      response
    );

    return {
      result: endResponse.result,
      history: [
        {
          resolverName: this.resolverToCache.name,
          sourceUri: uri,
          response,
        } as IUriResolutionStep<TError>,
      ],
    };
  }
}
