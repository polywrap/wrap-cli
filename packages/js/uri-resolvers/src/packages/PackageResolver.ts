import { ResolverWithHistory, UriResolutionResult } from "../helpers";

import { Uri, IWrapPackage, UriPackageOrWrapper } from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export class PackageResolver extends ResolverWithHistory {
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
