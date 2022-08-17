import {
  Uri,
  Client,
  WrapperCache,
  IUriResolver,
  InfiniteLoopError,
  Result,
  Ok,
} from "../../..";
import { UriResolverAggregatorBase } from "./UriResolverAggregatorBase";
import { UriResolverAggregatorOptions } from "./UriResolverAggregatorOptions";

export class UriResolverAggregator<
  TError = undefined
> extends UriResolverAggregatorBase<TError> {
  constructor(
    resolvers: IUriResolver<unknown>[],
    options: UriResolverAggregatorOptions
  );
  constructor(
    resolvers: (
      uri: Uri,
      client: Client,
      cache: WrapperCache
    ) => Promise<Result<IUriResolver<unknown>[], TError | InfiniteLoopError>>,
    options: UriResolverAggregatorOptions
  );
  constructor(
    resolvers: (
      uri: Uri,
      client: Client,
      cache: WrapperCache
    ) => Promise<IUriResolver<unknown>[]>,
    options: UriResolverAggregatorOptions
  );
  constructor(
    private resolvers:
      | IUriResolver<unknown>[]
      | ((
          uri: Uri,
          client: Client,
          cache: WrapperCache
        ) => Promise<IUriResolver<unknown>[]>)
      | ((
          uri: Uri,
          client: Client,
          cache: WrapperCache
        ) => Promise<
          Result<IUriResolver<unknown>[], TError | InfiniteLoopError>
        >),
    options: UriResolverAggregatorOptions
  ) {
    super(options);
  }

  async getUriResolvers(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<Result<IUriResolver<unknown>[], TError | InfiniteLoopError>> {
    if (Array.isArray(this.resolvers)) {
      return Ok(this.resolvers);
    } else {
      const result = await this.resolvers(uri, client, cache);

      if (Array.isArray(result)) {
        return Ok(result);
      } else {
        return result;
      }
    }
  }
}
