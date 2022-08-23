import {
  Uri,
  IUriResolver,
  toUri,
  IUriResolutionResponse,
  UriResolutionResponse,
} from "@polywrap/core-js";

export class RedirectResolver<TUri extends string | Uri = string>
  implements IUriResolver {
  from: Uri;
  to: Uri;

  constructor(from: TUri, to: TUri) {
    this.from = toUri(from);
    this.to = toUri(to);
  }

  public get name(): string {
    return `${RedirectResolver.name}(${this.from.uri} - ${this.to.uri})`;
  }

  async tryResolveUri(uri: Uri): Promise<IUriResolutionResponse> {
    if (uri.uri !== this.from.uri) {
      return UriResolutionResponse.ok(uri);
    }

    return UriResolutionResponse.ok(this.to);
  }
}
