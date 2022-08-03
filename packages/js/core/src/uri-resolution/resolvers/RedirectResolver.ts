import { IUriResolver, Uri, IUriResolutionResult } from "../..";

export class RedirectResolver implements IUriResolver {
  from: Uri;
  to: Uri;

  constructor(from: Uri, to: Uri) {
    this.from = from;
    this.to = to;
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
