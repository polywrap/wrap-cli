import {
  UriResolver,
  Uri,
  WrapClient,
  UriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/wrap-js";
import { Result } from "@polywrap/result";

// $start: ResolverWithHistory
/** An abstract IUriResolver implementation that updates the resolution context */
export abstract class ResolverWithHistory<TError = undefined>
  implements UriResolver<TError> /* $ */ {
  // $start: ResolverWithHistory-tryResolveUri
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * Updates the resolution context with the result.
   *
   * @remarks
   * This method calls the internal abstract method _tryResolveUri before
   * updating the resolution context. Implementations are expect to place
   * resolution logic in _tryResolveUri.
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that may be used to invoke a wrapper that implements the UriResolver interface
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  async tryResolveUri(
    uri: Uri,
    client: WrapClient,
    resolutionContext: UriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>> /* $ */ {
    const result = await this._tryResolveUri(uri, client, resolutionContext);

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      description: this.getStepDescription(uri, result),
    });

    return result;
  }

  // $start: ResolverWithHistory-getStepDescription
  /**
   * A utility function for generating step descriptions to facilitate resolution context updates
   *
   * @param uri - the URI being resolved
   * @param result - the result of a resolution attempt
   *
   * @returns text describing the URI resolution step
   * */
  protected abstract getStepDescription(
    uri: Uri,
    result: Result<UriPackageOrWrapper, TError>
  ): string;
  // $end

  // $start: ResolverWithHistory-_tryResolveUri
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * Updates the resolution context with the result.
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that may be used to invoke a wrapper that implements the UriResolver interface
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  protected abstract _tryResolveUri(
    uri: Uri,
    client: WrapClient,
    resolutionContext: UriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>>;
  // $end
}
