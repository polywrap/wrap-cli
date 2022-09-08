import { UriResolverAggregatorOptions } from ".";
import { InfiniteLoopError } from "../InfiniteLoopError";
import { fullyResolveUri } from "./fullyResolveUri";

import {
  IUriResolver,
  Uri,
  Client,
  IUriResolutionResponse,
  UriResolutionResponse,
  IUriResolutionStep,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export abstract class UriResolverAggregatorBase<TError = undefined>
  implements IUriResolver<TError | InfiniteLoopError> {
  constructor(private readonly options: UriResolverAggregatorOptions) {}

  get name(): string {
    return this.options.resolverName ?? "UriResolverAggregator";
  }

  abstract getUriResolvers(
    uri: Uri,
    client: Client
  ): Promise<Result<IUriResolver<unknown>[], TError | InfiniteLoopError>>;

  async tryResolveUri(
    uri: Uri,
    client: Client
  ): Promise<IUriResolutionResponse<TError | InfiniteLoopError>> {
    const result = await this.getUriResolvers(uri, client);

    if (!result.ok) {
      return UriResolutionResponse.err(result.error);
    }

    const resolvers = result.value as IUriResolver[];

    return await this.tryResolveUriWithResolvers(uri, client, resolvers);
  }

  protected async tryResolveUriWithResolvers(
    uri: Uri,
    client: Client,
    resolvers: IUriResolver<unknown>[]
  ): Promise<IUriResolutionResponse<TError | InfiniteLoopError>> {
    return this.options.endOnRedirect
      ? this.resolveUriOnce(client, resolvers, uri, [])
      : await fullyResolveUri(uri, (currentUri, history) =>
          this.resolveUriOnce(client, resolvers, currentUri, history)
        );
  }

  protected async resolveUriOnce(
    client: Client,
    resolvers: IUriResolver<unknown>[],
    currentUri: Uri,
    history: IUriResolutionStep<unknown>[]
  ): Promise<IUriResolutionResponse<TError>> {
    for (const resolver of resolvers) {
      const response = await resolver.tryResolveUri(currentUri, client);

      history.push({
        resolverName: resolver.name,
        sourceUri: currentUri,
        response,
      });

      if (!response.result.ok) {
        return UriResolutionResponse.err(
          response.result.error as TError,
          history
        );
      } else if (response.result.ok) {
        const uriPackageOrWrapper: UriPackageOrWrapper = response.result.value;

        if (uriPackageOrWrapper.type === "uri") {
          const resultUri = uriPackageOrWrapper.uri;

          if (resultUri.uri === currentUri.uri) {
            continue;
          }

          return UriResolutionResponse.ok(resultUri, history);
        } else {
          return UriResolutionResponse.ok(uriPackageOrWrapper, history);
        }
      }
    }

    return UriResolutionResponse.ok(currentUri, history);
  }
}
