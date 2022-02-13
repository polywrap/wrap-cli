import { applyRedirects } from "../../../algorithms";
import { Uri, Client } from "../../../types";
import { UriToApiResolver, UriResolutionResult } from "../../core";

export class RedirectsResolver implements UriToApiResolver {
  public get name(): string {
    return RedirectsResolver.name;
  }

  async resolveUri(uri: Uri, client: Client): Promise<UriResolutionResult> {
    const redirectedUri = applyRedirects(uri, client.getRedirects({}));

    return Promise.resolve({
      uri: redirectedUri,
    });
  }
}
