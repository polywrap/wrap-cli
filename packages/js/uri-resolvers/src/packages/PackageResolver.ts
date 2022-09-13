import {
  Uri,
  IUriResolver,
  IWrapPackage,
  UriPackageOrWrapper,
  UriResolutionResult,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export class PackageResolver implements IUriResolver {
  constructor(private uri: Uri, private wrapPackage: IWrapPackage) {}

  public get name(): string {
    return `PackageResolver (${this.uri.uri})`;
  }

  async tryResolveUri(uri: Uri): Promise<Result<UriPackageOrWrapper>> {
    if (uri.uri !== this.uri.uri) {
      return UriResolutionResult.ok(uri);
    }

    return UriResolutionResult.ok(uri, this.wrapPackage);
  }
}
