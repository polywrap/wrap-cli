import { IUriResolver, Uri, UriResolutionResult, toUri, Ok } from "../..";
import { UriResolutionResponse } from "../core/UriResolutionResponse";

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

  async tryResolveToWrapper(uri: Uri): Promise<UriResolutionResult> {
    if (uri.uri !== this.from.uri) {
      return {
        response: Ok(new UriResolutionResponse(uri)),
      };
    }

    return {
      response: Ok(new UriResolutionResponse(this.to)),
    };
  }
}
