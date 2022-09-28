import {
  IUriResolver,
  Uri,
  Client,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";
import { UriResolutionResult } from "../helpers";

export abstract class UriResolverAggregatorBase<
  TResolutionError = undefined,
  TGetResolversError = undefined
> implements IUriResolver<TResolutionError | TGetResolversError> {
  abstract getUriResolvers(
    uri: Uri,
    client: Client,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<IUriResolver<unknown>[], TGetResolversError>>;

  async tryResolveUri(
    uri: Uri,
    client: Client,
    resolutionContext: IUriResolutionContext
  ): Promise<
    Result<UriPackageOrWrapper, TResolutionError | TGetResolversError>
  > {
    const resolverResult = await this.getUriResolvers(
      uri,
      client,
      resolutionContext
    );

    if (!resolverResult.ok) {
      return resolverResult;
    }

    const resolvers = resolverResult.value as IUriResolver[];

    return await this.tryResolveUriWithResolvers(
      uri,
      client,
      resolvers,
      resolutionContext
    );
  }

  protected abstract getStepDescription(
    uri: Uri,
    result: Result<UriPackageOrWrapper, TResolutionError>
  ): string;

  protected async tryResolveUriWithResolvers(
    uri: Uri,
    client: Client,
    resolvers: IUriResolver<unknown>[],
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TResolutionError>> {
    const subContext = resolutionContext.createSubHistoryContext();

    for (const resolver of resolvers) {
      const typeResolver = resolver as IUriResolver<TResolutionError>;

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
