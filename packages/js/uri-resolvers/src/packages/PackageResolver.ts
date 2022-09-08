import {
  Uri,
  IUriResolver,
  IWrapPackage,
  UriPackageOrWrapper,
  UriResolutionResult,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export class PackageResolver implements IUriResolver {
  packageUri: Uri;

  constructor(private wrapPackage: IWrapPackage) {
    this.packageUri = wrapPackage.uri;
  }

  public get name(): string {
    return `PackageResolver (${this.packageUri.uri})`;
  }

  async tryResolveUri(uri: Uri): Promise<Result<UriPackageOrWrapper>> {
    if (uri.uri !== this.packageUri.uri) {
      return UriResolutionResult.ok(uri);
    }

    return UriResolutionResult.ok(this.wrapPackage);
  }
}
