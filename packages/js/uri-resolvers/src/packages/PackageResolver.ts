import {
  Uri,
  IWrapPackage,
  UriPackageOrWrapper,
  UriResolutionResult,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";
import { ResolverWithHistory } from "../helpers";

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
