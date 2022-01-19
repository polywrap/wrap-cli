import { applyRedirects } from "../../../algorithms";
import { Uri, Client } from "../../../types";
import { IUriToApiResolver, UriResolutionResult } from "../../core";

export class RedirectsResolver implements IUriToApiResolver {
  name = "Redirect";

  async resolveUri(uri: Uri, client: Client): Promise<UriResolutionResult> {
    const redirectedUri = applyRedirects(uri, client.getRedirects({}));

    return Promise.resolve({
      uri: redirectedUri,
    });
  }
}
