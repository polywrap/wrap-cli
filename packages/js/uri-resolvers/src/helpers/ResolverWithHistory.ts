import {
  IUriResolver,
  Uri,
  CoreClient,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export abstract class ResolverWithHistory<TError = undefined>
  implements IUriResolver<TError> {
  async tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>> {
    const result = await this._tryResolveUri(uri, client, resolutionContext);

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      description: this.getStepDescription(uri, result),
    });

    return result;
  }

  protected abstract getStepDescription(
    uri: Uri,
    result: Result<UriPackageOrWrapper, TError>
  ): string;

  protected abstract _tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>>;
}
