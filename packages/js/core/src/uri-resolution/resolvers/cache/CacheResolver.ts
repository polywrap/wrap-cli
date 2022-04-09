import { Uri, Client, ApiCache } from "../../../types";
import { UriResolver, UriResolutionResult } from "../../core";

export class CacheResolver implements UriResolver {
  public get name(): string {
    return CacheResolver.name;
  }

  public async resolveUri(
    uri: Uri,
    client: Client,
    cache: ApiCache
  ): Promise<UriResolutionResult> {
    const api = cache.get(uri.uri);

    return Promise.resolve({
      uri: uri,
      api: api,
    });
  }
}
