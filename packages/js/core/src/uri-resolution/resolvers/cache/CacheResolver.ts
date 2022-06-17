import { Uri, Client, WrapperCache } from "../../../types";
import { UriResolver, UriResolutionResult } from "../../core";

export class CacheResolver implements UriResolver {
  public get name(): string {
    return CacheResolver.name;
  }

  public async resolveUri(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<UriResolutionResult> {
    const wrapper = cache.get(uri.uri);

    return Promise.resolve({
      uri: uri,
      wrapper: wrapper,
    });
  }
}
