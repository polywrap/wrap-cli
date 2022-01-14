import { applyRedirects } from "../..";
import { Uri, Client } from "../../..";
import { UriResolutionResult } from "./UriResolutionResult";
import { UriToApiResolver } from "./UriToApiResolver";

export class RedirectsResolver implements UriToApiResolver {
  name = "Redirect";

  async resolveUri(uri: Uri, client: Client): Promise<UriResolutionResult> {
    let redirectedUri = applyRedirects(uri, client.getRedirects({}));
    
    return Promise.resolve({
      uri: redirectedUri,
    });
  };
}
