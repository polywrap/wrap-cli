import { ResolverWithHistory, UriResolutionResult } from "../helpers";

import { Uri, UriPackageOrWrapper } from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export class RedirectResolver<
  TUri extends string | Uri = string
> extends ResolverWithHistory {
  from: Uri;
  to: Uri;

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
