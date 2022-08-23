import {
  Uri,
  Client,
  IUriResolutionResponse,
  UriResolutionResponse,
  Wrapper,
} from "@polywrap/core-js";
import { ICacheResolver } from ".";
import { getUriHistory } from "../getUriHistory";

// This cache resolver caches wrappers
// Packages are turned into wrappers before caching
export class PackageToWrapperCacheResolver implements ICacheResolver<unknown> {
  constructor(private cache: Map<string, Wrapper>) {}

  public get name(): string {
    return PackageToWrapperCacheResolver.name;
  }

  public async tryResolveToWrapper(
    uri: Uri,
    _: Client
  ): Promise<IUriResolutionResponse> {
    const wrapper = this.cache.get(uri.uri);

    if (wrapper) {
      return UriResolutionResponse.ok(wrapper);
    }

    return UriResolutionResponse.ok(uri);
  }

  async onResolutionEnd(
    uri: Uri,
    client: Client,
    response: IUriResolutionResponse<unknown>
  ): Promise<IUriResolutionResponse<unknown>> {
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
