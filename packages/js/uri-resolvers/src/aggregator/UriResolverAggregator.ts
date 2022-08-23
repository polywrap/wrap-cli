import { UriResolverAggregatorBase } from "./UriResolverAggregatorBase";
import { UriResolverAggregatorOptions } from "./UriResolverAggregatorOptions";
import { InfiniteLoopError } from "..";

import { IUriResolver, Uri, Client, Result, Ok } from "@polywrap/core-js";

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
      client: Client
    ) => Promise<Result<IUriResolver<unknown>[], TError | InfiniteLoopError>>,
    options: UriResolverAggregatorOptions
  );
  constructor(
    resolvers: (uri: Uri, client: Client) => Promise<IUriResolver<unknown>[]>,
    options: UriResolverAggregatorOptions
  );
  constructor(
    private resolvers:
      | IUriResolver<unknown>[]
      | ((uri: Uri, client: Client) => Promise<IUriResolver<unknown>[]>)
      | ((
          uri: Uri,
          client: Client
        ) => Promise<
          Result<IUriResolver<unknown>[], TError | InfiniteLoopError>
        >),
    options: UriResolverAggregatorOptions
  ) {
    super(options);
  }

  async getUriResolvers(
    uri: Uri,
    client: Client
  ): Promise<Result<IUriResolver<unknown>[], TError | InfiniteLoopError>> {
    if (Array.isArray(this.resolvers)) {
      return Ok(this.resolvers);
    } else {
      const result = await this.resolvers(uri, client);

      if (Array.isArray(result)) {
        return Ok(result);
      } else {
        return result;
      }
    }
  }
}
