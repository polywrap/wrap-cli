import {
  Uri,
  Client,
  WrapperCache,
  IUriResolutionResponse,
  UriResolutionResponse,
} from "@polywrap/core-js";
import { ICacheResolver } from "../cache";
import { getUriHistory } from "../getUriHistory";

// This resolver uses the internal client cache
// It only caches wrappers
// It ignores URIs
// Packages are turned into wrappers before caching
export class LegacyCacheResolver implements ICacheResolver<unknown> {
  public get name(): string {
    return LegacyCacheResolver.name;
  }

  public async tryResolveToWrapper(
    uri: Uri,
    _: Client,
    cache: WrapperCache
  ): Promise<IUriResolutionResponse> {
    const wrapper = cache.get(uri.uri);

    if (wrapper) {
      return UriResolutionResponse.ok(wrapper);
    }

    return UriResolutionResponse.ok(uri);
  }

  async onResolutionEnd(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    response: IUriResolutionResponse<unknown>
  ): Promise<IUriResolutionResponse<unknown>> {
    if (response.result.ok) {
      if (response.result.value.type === "wrapper") {
        cache.set(uri.uri, response.result.value.wrapper);
      } else if (response.result.value.type === "package") {
        const uriHistory: Uri[] = !response.history
          ? [uri]
          : [uri, ...getUriHistory(response.history)];

        const wrapper = await response.result.value.package.createWrapper(
          client,
          uriHistory
        );
        cache.set(uri.uri, wrapper);

        return UriResolutionResponse.ok(wrapper);
      }
    }

    return response;
  }
}
