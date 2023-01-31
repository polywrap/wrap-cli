import { ResolverWithHistory, UriResolutionResult } from "../helpers";

import { Uri, UriPackageOrWrapper } from "@polywrap/core-js";
import { Result } from "@polywrap/result";

/**
 * A Uri Resolver that resolves to a new URI and correctly updates the
 * resolution history.
 * */
export class RedirectResolver<
  TUri extends string | Uri = string
> extends ResolverWithHistory {
  from: Uri;
  to: Uri;

  /**
   * Construct a RedirectResolver
   *
   * @param from - the URI to redirect from
   * @param to - the URI to redirect to
   * */
  constructor(from: TUri, to: TUri) {
    super();
    this.from = Uri.from(from);
    this.to = Uri.from(to);
  }

  protected getStepDescription = (): string =>
    `Redirect (${this.from.uri} - ${this.to.uri})`;

  protected async _tryResolveUri(
    uri: Uri
  ): Promise<Result<UriPackageOrWrapper>> {
    if (uri.uri !== this.from.uri) {
      return UriResolutionResult.ok(uri);
    }

    return UriResolutionResult.ok(this.to);
  }
}
