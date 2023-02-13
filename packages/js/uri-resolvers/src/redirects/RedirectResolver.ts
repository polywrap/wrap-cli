import { ResolverWithHistory, UriResolutionResult } from "../helpers";

import { Uri, UriPackageOrWrapper } from "@polywrap/core-js";
import { Result } from "@polywrap/result";

// $start: RedirectResolver
/**
 * A Uri Resolver that resolves to a new URI and correctly updates the
 * resolution history.
 * */
export class RedirectResolver<
  TUri extends string | Uri = string
> extends ResolverWithHistory /* $ */ {
  from: Uri;
  to: Uri;

  // $start: RedirectResolver-constructor
  /**
   * Construct a RedirectResolver
   *
   * @param from - the URI to redirect from
   * @param to - the URI to redirect to
   * */
  constructor(from: TUri, to: TUri) /* $ */ {
    super();
    this.from = Uri.from(from);
    this.to = Uri.from(to);
  }

  // $start: RedirectResolver-getStepDescription
  /**
   * A utility function for generating step descriptions to facilitate resolution context updates
   *
   * @returns text describing the URI resolution step
   * */
  protected getStepDescription = (): string /* $ */ =>
    `Redirect (${this.from.uri} - ${this.to.uri})`;

  // $start: RedirectResolver-_tryResolveUri
  /**
   * Resolve a URI to a new URI
   *
   * @param uri - the URI to resolve
   * @returns A Promise with a Result containing a URI if successful
   */
  protected async _tryResolveUri(
    uri: Uri
  ): Promise<Result<UriPackageOrWrapper>> /* $ */ {
    if (uri.uri !== this.from.uri) {
      return UriResolutionResult.ok(uri);
    }

    return UriResolutionResult.ok(this.to);
  }
}
