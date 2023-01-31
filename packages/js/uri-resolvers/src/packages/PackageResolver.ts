import { ResolverWithHistory, UriResolutionResult } from "../helpers";

import { Uri, IWrapPackage, UriPackageOrWrapper } from "@polywrap/core-js";
import { Result } from "@polywrap/result";

/**
 * A Uri Resolver that resolves to an embedded wrap package and correctly updates
 * the resolution history.
 * */
export class PackageResolver extends ResolverWithHistory {
  /**
   * Construct a PackageResolver
   *
   * @param _uri - the URI to redirect to the wrap package
   * @param wrapPackage - a wrap package
   * */
  constructor(private _uri: Uri, private wrapPackage: IWrapPackage) {
    super();
  }

  protected getStepDescription = (): string => `Package (${this._uri.uri})`;

  protected async _tryResolveUri(
    uri: Uri
  ): Promise<Result<UriPackageOrWrapper>> {
    if (uri.uri !== this._uri.uri) {
      return UriResolutionResult.ok(uri);
    }

    return UriResolutionResult.ok(uri, this.wrapPackage);
  }
}
