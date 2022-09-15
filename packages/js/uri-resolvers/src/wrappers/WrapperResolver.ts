import {
  Uri,
  IUriResolver,
  UriPackageOrWrapper,
  UriResolutionResult,
  Wrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export class WrapperResolver implements IUriResolver {
  constructor(private uri: Uri, private wrapper: Wrapper) {}

  public get name(): string {
    return `Wrapper (${this.uri.uri})`;
  }

  async tryResolveUri(uri: Uri): Promise<Result<UriPackageOrWrapper>> {
    if (uri.uri !== this.uri.uri) {
      return UriResolutionResult.ok(uri);
    }

    return UriResolutionResult.ok(uri, this.wrapper);
  }
}
