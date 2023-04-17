import { ResolverWithHistory, UriResolutionResult } from "../helpers";

import { Uri, IWrapPackage, UriPackageOrWrapper } from "@polywrap/core-js";
import { Result } from "@polywrap/result";

// $start: PackageResolver
/**
 * A Uri Resolver that resolves to an embedded wrap package and correctly updates
 * the resolution history.
 * */
export class PackageResolver extends ResolverWithHistory /* $ */ {
  // $start: PackageResolver-constructor
  /**
   * Construct a PackageResolver
   *
   * @param _uri - the URI to redirect to the wrap package
   * @param wrapPackage - a wrap package
   * */
  constructor(private _uri: Uri, private wrapPackage: IWrapPackage) /* $ */ {
    super();
  }

  // $start: PackageResolver-getStepDescription
  /**
   * A utility function for generating step descriptions to facilitate resolution context updates
   *
   * @returns text describing the URI resolution step
   * */
  protected getStepDescription = (): string /* $ */ =>
    `Package (${this._uri.uri})`;

  // $start: PackageResolver-_tryResolveUri
  /**
   * Resolve a URI to a wrap package
   *
   * @param uri - the URI to resolve
   * @returns A Promise with a Result containing a wrap package if successful
   */
  protected async _tryResolveUri(
    uri: Uri
  ): Promise<Result<UriPackageOrWrapper>> /* $ */ {
    if (uri.uri !== this._uri.uri) {
      return UriResolutionResult.ok(uri);
    }

    return UriResolutionResult.ok(uri, this.wrapPackage);
  }
}
