import { applyRedirects } from "../../../algorithms";
import { Uri, Client } from "../../..";
import { UriResolutionResult } from "../../core/types/UriResolutionResult";
import { IUriToApiResolver } from "../../core/types/IUriToApiResolver";

export class RedirectsResolver implements IUriToApiResolver {
  name = "Redirect";

  async resolveUri(uri: Uri, client: Client): Promise<UriResolutionResult> {
    const redirectedUri = applyRedirects(uri, client.getRedirects({}));

    return Promise.resolve({
      uri: redirectedUri,
    });
  }
}
