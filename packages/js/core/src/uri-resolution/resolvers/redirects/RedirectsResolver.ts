import { applyRedirects } from "../../../algorithms";
import { Uri, Client } from "../../../types";
import { UriResolver, UriResolutionResult } from "../../core";

export class RedirectsResolver implements UriResolver {
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
