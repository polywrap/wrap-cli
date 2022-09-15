import { ResolverWithHistory } from "../helpers";

import {
  Uri,
  toUri,
  UriResolutionResult,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export class RedirectResolver<
  TUri extends string | Uri = string
> extends ResolverWithHistory {
  from: Uri;
  to: Uri;

  constructor(from: TUri, to: TUri) {
    super();
    this.from = toUri(from);
    this.to = toUri(to);
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
