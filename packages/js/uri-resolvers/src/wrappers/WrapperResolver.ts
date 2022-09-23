import {
  Uri,
  UriPackageOrWrapper,
  UriResolutionResult,
  Wrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";
import { ResolverWithHistory } from "../helpers";

export class WrapperResolver extends ResolverWithHistory {
  constructor(private uri: Uri, private wrapper: Wrapper) {
    super();
  }

  protected getStepDescription = (): string => `Wrapper (${this.uri.uri})`;

  protected async _tryResolveUri(
    uri: Uri
  ): Promise<Result<UriPackageOrWrapper>> {
    if (uri.uri !== this.uri.uri) {
      return UriResolutionResult.ok(uri);
    }

    return UriResolutionResult.ok(uri, this.wrapper);
  }
}
