import { Uri, Client } from "../../..";
import { IUriToApiResolver, UriResolutionResult } from "../../core";

export class CacheResolver implements IUriToApiResolver {
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