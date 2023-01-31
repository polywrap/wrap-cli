import { ResolverWithHistory, UriResolutionResult } from "../helpers";

import { Uri, UriPackageOrWrapper, Wrapper } from "@polywrap/core-js";
import { Result } from "@polywrap/result";

// $start: WrapperResolver
/**
 * A Uri Resolver that resolves to an embedded wrapper and correctly updates
 * the resolution history.
 * */
export class WrapperResolver extends ResolverWithHistory /* $ */ {
  // $start: WrapperResolver-constructor
  /**
   * Construct a WrapperResolver
   *
   * @param _uri - the URI to redirect to the wrapper instance
   * @param _wrapper - a wrapper
   * */
  constructor(private _uri: Uri, private _wrapper: Wrapper) /* $ */ {
    super();
  }

  // $start: WrapperResolver-getStepDescription
  protected getStepDescription = (): string /* $ */ =>
    `Wrapper (${this._uri.uri})`;

  // $start: WrapperResolver-_tryResolveUri
  protected async _tryResolveUri(
    uri: Uri
  ): Promise<Result<UriPackageOrWrapper>> /* $ */ {
    if (uri.uri !== this._uri.uri) {
      return UriResolutionResult.ok(uri);
    }

    return UriResolutionResult.ok(uri, this._wrapper);
  }
}
