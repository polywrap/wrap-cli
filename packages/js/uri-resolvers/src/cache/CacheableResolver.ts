import { ICacheResolver } from "./ICacheResolver";

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

  constructor(
    public cacheResolver: ICacheResolver<TError>,
    public resolver: IUriResolver<TError>,
    name?: string
  ) {
    if (name) {
      this.name = name;
    } else {
      this.name = CacheableResolver.name;
    }
  }

  async tryResolveUri(
    uri: Uri,
    client: Client,
    resolutionPath: IUriResolutionStep<unknown>[]
  ): Promise<IUriResolutionResponse<TError>> {
    const cachedResponse = await this.cacheResolver.tryResolveUri(
      uri,
      client,
      resolutionPath
    );

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

    const response = await this.resolver.tryResolveUri(
      uri,
      client,
      resolutionPath
    );

    const endResponse = await this.cacheResolver.onResolutionEnd(
      uri,
      client,
      response
    );

    return {
      result: endResponse.result,
      history: [
        {
          resolverName: this.resolver.name,
          sourceUri: uri,
          response,
        } as IUriResolutionStep<TError>,
      ],
    };
  }
}
