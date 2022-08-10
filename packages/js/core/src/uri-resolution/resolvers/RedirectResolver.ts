import {
  IUriResolver,
  Uri,
  UriResolutionResult,
  toUri,
  Result,
  Ok,
} from "../..";

export class RedirectResolver<TUri extends string | Uri = string>
  implements IUriResolver {
  from: Uri;
  to: Uri;

  constructor(from: TUri, to: TUri) {
    this.from = toUri(from);
    this.to = toUri(to);
  }

  public get name(): string {
    return `${RedirectResolver.name} - ${this.from.uri} - ${this.to.uri}`;
  }

  async tryResolveToWrapper(uri: Uri): Promise<Result<UriResolutionResult>> {
    if (uri.uri !== this.from.uri) {
      return Ok(new UriResolutionResult(uri));
    }

    return Ok(new UriResolutionResult(this.to));
  }
}
