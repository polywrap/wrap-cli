import { Uri, Client, WrapperCache } from "../../../types";
import { ResolveUriResult, UriResolver } from "../../core";

export class CacheResolver implements UriResolver<void> {
  public get name(): string {
    return CacheResolver.name;
  }

  public async tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<ResolveUriResult<void>> {
    const wrapper = cache.get(uri.uri);

    return Promise.resolve({
      uri: uri,
      wrapper: wrapper,
    });
  }
}
