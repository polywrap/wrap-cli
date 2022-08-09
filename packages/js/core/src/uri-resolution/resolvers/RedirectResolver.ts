import { IUriResolver, Uri, IUriResolutionResult, toUri } from "../..";

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

  async tryResolveToWrapper(uri: Uri): Promise<IUriResolutionResult> {
    if (uri.uri !== this.from.uri) {
      return this.notFound(uri);
    }

    return {
      uri: this.to,
    };
  }

  notFound(uri: Uri): IUriResolutionResult {
    return {
      uri,
    };
  }
}
