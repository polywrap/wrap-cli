import { ResolverWithHistory, UriResolutionResult } from "../helpers";

import { Uri, UriPackageOrWrapper, Wrapper } from "@polywrap/core-js";
import { Result } from "@polywrap/result";

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
