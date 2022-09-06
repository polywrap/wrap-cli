import {
  Uri,
  IUriResolver,
  toUri,
  UriResolutionResult,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export class RedirectResolver<TUri extends string | Uri = string>
  implements IUriResolver {
  from: Uri;
  to: Uri;

  constructor(from: TUri, to: TUri) {
    this.from = toUri(from);
    this.to = toUri(to);
  }

  public get name(): string {
    return `RedirectResolver(${this.from.uri} - ${this.to.uri})`;
  }

  async tryResolveUri(uri: Uri): Promise<Result<UriPackageOrWrapper>> {
    if (uri.uri !== this.from.uri) {
      return UriResolutionResult.ok(uri);
    }

    return UriResolutionResult.ok(this.to);
  }
}
