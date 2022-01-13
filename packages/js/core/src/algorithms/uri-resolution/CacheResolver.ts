import { UriToApiResolver, UriResolutionResult } from ".";
import { Uri, Client } from "../..";

export class CacheResolver implements UriToApiResolver {
  name = "Cache";

  async resolveUri(
    uri: Uri, 
    client: Client
  ): Promise<UriResolutionResult> {
    const api = client.getApiCache().get(uri.uri);
      
    return Promise.resolve({
      uri: uri,
      api: api,
    });
  }
}