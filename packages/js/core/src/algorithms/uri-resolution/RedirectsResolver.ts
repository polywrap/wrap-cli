import { Uri, Client } from "../../types";
import { applyRedirects } from "../apply-redirects";
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
