import { Uri, Client, ApiCache } from "../../../types";
import { UriToApiResolver, UriResolutionResult } from "../../core";

export class CacheResolver implements UriToApiResolver {

  public get name() {
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
