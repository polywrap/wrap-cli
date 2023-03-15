import { UriResolutionResult } from "../helpers";

import {
  UriResolver,
  Uri,
  WrapClient,
  UriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/wrap-js";
import { Result } from "@polywrap/result";

// $start: UriResolverAggregatorBase
/**
 * Abstract class for IUriResolver implementations that aggregate multiple resolvers.
 * The UriResolverAggregatorBase class attempts to resolve a URI by sequentially
 * attempting resolution with each of its composite resolvers.
 * */
export abstract class UriResolverAggregatorBase<
  TResolutionError = undefined,
  TGetResolversError = undefined
> implements UriResolver<TResolutionError | TGetResolversError> /* $ */ {
  // $start: UriResolverAggregatorBase-getUriResolvers
  /**
   * Get a list of URI Resolvers
   *
   * @param uri - the URI to query for resolvers
   * @param client - a CoreClient instance that can be used to make an invocation
   * @param resolutionContext - a resolution context to update when resolving URIs
   *
   * @returns a list of IUriResolver or an error
   * */
  abstract getUriResolvers(
    uri: Uri,
    client: WrapClient,
    resolutionContext: UriResolutionContext
  ): Promise<Result<UriResolver<unknown>[], TGetResolversError>>;
  // $end

  // $start: UriResolverAggregatorBase-tryResolveUri
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * Attempts to resolve the URI using each of the aggregated resolvers sequentially.
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
  ): Promise<
    Result<UriPackageOrWrapper, TResolutionError | TGetResolversError>
  > /* $ */ {
    const resolverResult = await this.getUriResolvers(
      uri,
      client,
      resolutionContext
    );

    if (!resolverResult.ok) {
      return resolverResult;
    }

    const resolvers = resolverResult.value as UriResolver[];

    return await this.tryResolveUriWithResolvers(
      uri,
      client,
      resolvers,
      resolutionContext
    );
  }

  // $start: UriResolverAggregatorBase-getStepDescription
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
    result: Result<UriPackageOrWrapper, TResolutionError>
  ): string;
  // $end

  // $start: UriResolverAggregatorBase-tryResolveUriWithResolvers
  /**
   * Using each of the aggregated resolvers, attempt to resolve a URI
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that can be used to make an invocation
   * @param resolvers - a list of IUriResolver implementations
   * @param resolutionContext - a resolution context to update when resolving URIs
   *
   * @returns a URI, a Wrap Package, or a Wrapper (or an error)
   * */
  protected async tryResolveUriWithResolvers(
    uri: Uri,
    client: WrapClient,
    resolvers: UriResolver<unknown>[],
    resolutionContext: UriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TResolutionError>> /* $ */ {
    const subContext = resolutionContext.createSubHistoryContext();

    for (const resolver of resolvers) {
      const typeResolver = resolver as UriResolver<TResolutionError>;

      const result = await typeResolver.tryResolveUri(uri, client, subContext);

      if (
        !(
          result.ok &&
          result.value.type === "uri" &&
          result.value.uri.uri === uri.uri
        )
      ) {
        resolutionContext.trackStep({
          sourceUri: uri,
          result,
          subHistory: subContext.getHistory(),
          description: this.getStepDescription(uri, result),
        });

        return result;
      }
    }

    const result = UriResolutionResult.ok(uri);

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      subHistory: subContext.getHistory(),
      description: this.getStepDescription(uri, result),
    });

    return result;
  }
}
