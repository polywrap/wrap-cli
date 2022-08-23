import { ICacheResolver } from "./ICacheResolver";
import { getUriHistory } from "../getUriHistory";
import { IWrapperCache } from "./IWrapperCache";

import {
  Uri,
  Client,
  IUriResolutionResponse,
  UriResolutionResponse,
} from "@polywrap/core-js";

// This cache resolver caches wrappers
// Packages are turned into wrappers before caching
export class PackageToWrapperCacheResolver implements ICacheResolver<unknown> {
  constructor(private cache: IWrapperCache) {}

  public get name(): string {
    return PackageToWrapperCacheResolver.name;
  }

  public async tryResolveUri(
    uri: Uri,
    _: Client
  ): Promise<IUriResolutionResponse> {
    const wrapper = this.cache.get(uri);

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
        this.cache.set(uri, response.result.value.wrapper);
      } else if (response.result.value.type === "package") {
        const uriHistory: Uri[] = !response.history
          ? [uri]
          : [uri, ...getUriHistory(response.history)];

        const wrapper = await response.result.value.package.createWrapper(
          client,
          uriHistory
        );
        this.cache.set(uri, wrapper);

        return UriResolutionResponse.ok(wrapper);
      }
    }

    return response;
  }
}
