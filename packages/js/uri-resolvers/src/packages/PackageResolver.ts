import {
  Uri,
  IUriResolver,
  UriResolutionResponse,
  IUriResolutionResponse,
  IWrapPackage,
} from "@polywrap/core-js";

export class PackageResolver implements IUriResolver {
  packageUri: Uri;

  constructor(private wrapPackage: IWrapPackage) {
    this.packageUri = wrapPackage.uri;
  }

  public get name(): string {
    return `PackageResolver (${this.packageUri.uri})`;
  }

  async tryResolveUri(uri: Uri): Promise<IUriResolutionResponse> {
    if (uri.uri !== this.packageUri.uri) {
      return UriResolutionResponse.ok(uri);
    }

    return UriResolutionResponse.ok(this.wrapPackage);
  }
}
