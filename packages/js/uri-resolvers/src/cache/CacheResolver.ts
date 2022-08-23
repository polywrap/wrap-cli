import {
  IUriResolutionResponse,
  Uri,
  IUriResolutionStep,
  UriResolutionResponse,
  Client,
} from "@polywrap/core-js";
import { ICacheResolver } from "./ICacheResolver";

// This cache resolver caches all responses (URIs, packages, wrappers and errors)
export class ResponseCacheResolver<TError = undefined>
  implements ICacheResolver<TError> {
  public get name(): string {
    return ResponseCacheResolver.name;
  }

  constructor(private cache: Map<string, IUriResolutionResponse<TError>>) {}

  public async tryResolveToWrapper(
    uri: Uri
  ): Promise<IUriResolutionResponse<TError>> {
    const cachedResponse = this.cache.get(uri.uri);

    if (cachedResponse) {
      return {
        result: cachedResponse.result,
        history: [
          {
            resolverName: "Cache hit",
            sourceUri: uri,
            response: cachedResponse,
          } as IUriResolutionStep<TError>,
        ],
      };
    }

    return UriResolutionResponse.ok(uri);
  }

  async onResolutionEnd(
    uri: Uri,
    client: Client,
    response: IUriResolutionResponse<TError>
  ): Promise<IUriResolutionResponse<TError>> {
    this.cache.set(uri.uri, response);

    return response;
  }
}
