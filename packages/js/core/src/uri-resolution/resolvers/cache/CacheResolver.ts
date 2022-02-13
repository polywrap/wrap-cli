import { Uri, Client, ApiCache } from "../../../types";
import { IUriToApiResolver, UriResolutionResult } from "../../core";

export class CacheResolver implements IUriToApiResolver {
  name = "Cache";

  async resolveUri(
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
