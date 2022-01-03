import { UriRedirect, Uri } from "../../types";
import { applyRedirects } from "../apply-redirects";
import { MaybeUriOrApi } from "./MaybeUriOrApi";
import { UriToApiResolver } from "./UriToApiResolver";

export class RedirectsResolver implements UriToApiResolver {
  constructor(
    private readonly redirects: readonly UriRedirect<Uri>[],
  ) { }

  name = "RedirectsResolver";

  async resolveUri(uri: Uri): Promise<MaybeUriOrApi> {
    let redirectedUri = applyRedirects(uri, this.redirects);
    
    return Promise.resolve({
      uri: redirectedUri
    });
  };
}
