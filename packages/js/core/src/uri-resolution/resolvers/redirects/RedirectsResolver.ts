import { applyRedirects } from "../../../algorithms";
import { Uri, Client } from "../../../types";
import { UriResolver, ResolveUriResult } from "../../core";

export class RedirectsResolver implements UriResolver<void> {
  public get name(): string {
    return RedirectsResolver.name;
  }

  async tryResolveToWrapper(
    uri: Uri,
    client: Client
  ): Promise<ResolveUriResult<void>> {
    const redirectedUri = applyRedirects(uri, client.getRedirects({}));

    return Promise.resolve({
      uri: redirectedUri,
    });
  }
}
