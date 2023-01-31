import {
  IUriResolver,
  Uri,
  CoreClient,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

/** An abstract IUriResolver implementation that updates the resolution context */
export abstract class ResolverWithHistory<TError = undefined>
  implements IUriResolver<TError> {
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * Updates the resolution context with the result.
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that may be used to invoke a wrapper that implements the UriResolver interface
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
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
