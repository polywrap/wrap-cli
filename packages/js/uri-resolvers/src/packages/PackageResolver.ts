import {
  Uri,
  IUriResolver,
  UriResolutionResponse,
  IUriResolutionResponse,
  toUri,
  IPackageRegistration,
} from "@polywrap/core-js";

export class PackageResolver implements IUriResolver {
  packageUri: Uri;

  constructor(private packageRegistration: IPackageRegistration<string | Uri>) {
    this.packageUri = toUri(packageRegistration.uri);
  }

  public get name(): string {
    return `PackageResolver (${this.packageUri.uri})`;
  }

  async tryResolveUri(uri: Uri): Promise<IUriResolutionResponse> {
    if (uri.uri !== this.packageUri.uri) {
      return UriResolutionResponse.ok(uri);
    }

    return UriResolutionResponse.ok(this.packageRegistration.package);
  }
}
