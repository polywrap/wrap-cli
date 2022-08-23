import {
  Uri,
  Client,
  IUriResolutionResponse,
  UriResolutionResponse,
  Wrapper,
} from "@polywrap/core-js";
import { ICacheResolver } from "../cache";
import { getUriHistory } from "../getUriHistory";

// This resolver only caches wrappers
// It ignores URIs
// Packages are turned into wrappers before caching
export class WrapperCacheResolver<TError> implements ICacheResolver<TError> {
  public get name(): string {
    return WrapperCacheResolver.name;
  }

  constructor(private cache: Map<string, Wrapper>) {}

  public async tryResolveUri(
    uri: Uri
  ): Promise<IUriResolutionResponse<TError>> {
    const wrapper = this.cache.get(uri.uri);

    if (wrapper) {
      return UriResolutionResponse.ok(wrapper);
    }

    return UriResolutionResponse.ok(uri);
  }

  async onResolutionEnd(
    uri: Uri,
    client: Client,
    response: IUriResolutionResponse<TError>
  ): Promise<IUriResolutionResponse<TError>> {
    if (response.result.ok) {
      if (response.result.value.type === "wrapper") {
        this.cache.set(uri.uri, response.result.value.wrapper);
      } else if (response.result.value.type === "package") {
        const uriHistory: Uri[] = !response.history
          ? [uri]
          : [uri, ...getUriHistory(response.history)];

        const wrapper = await response.result.value.package.createWrapper(
          client,
          uriHistory
        );
        this.cache.set(uri.uri, wrapper);

        return UriResolutionResponse.ok(wrapper);
      }
    }

    return response;
  }
}
