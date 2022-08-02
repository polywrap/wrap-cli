import { applyRedirects } from "../../algorithms";
import { Uri, Client } from "../../types";
import { IUriResolver } from "../core";
import { IUriResolutionResult } from "../core/types";

export class RedirectsResolver implements IUriResolver {
  public get name(): string {
    return RedirectsResolver.name;
  }

  async tryResolveToWrapper(
    uri: Uri,
    client: Client
  ): Promise<IUriResolutionResult> {
    const redirectedUri = applyRedirects(uri, client.getRedirects({}));

    return Promise.resolve({
      uri: redirectedUri,
    });
  }
}
