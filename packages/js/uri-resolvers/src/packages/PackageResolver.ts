import { ResolverWithHistory, UriResolutionResult } from "../helpers";

import { Uri, IWrapPackage, UriPackageOrWrapper } from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export class PackageResolver extends ResolverWithHistory {
  constructor(private uri: Uri, private wrapPackage: IWrapPackage) {
    super();
  }

  protected getStepDescription = (): string => `Package (${this.uri.uri})`;

  protected async _tryResolveUri(
    uri: Uri
  ): Promise<Result<UriPackageOrWrapper>> {
    if (uri.uri !== this.uri.uri) {
      return UriResolutionResult.ok(uri);
    }

    return UriResolutionResult.ok(uri, this.wrapPackage);
  }
}
