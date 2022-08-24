import { UriResolverAggregatorBase } from "./UriResolverAggregatorBase";
import { UriResolverAggregatorOptions } from "./UriResolverAggregatorOptions";
import { InfiniteLoopError } from "..";

import { IUriResolver, Uri, Client, Result, ResultOk } from "@polywrap/core-js";
import { UriResolverLike } from "../UriResolverLike";
import { buildUriResolver } from "../buildUriResolver";

export type GetResolversFunc = (
  uri: Uri,
  client: Client
) => Promise<IUriResolver<unknown>[]>;

export type GetResolversWithErrorFunc<TError> = (
  uri: Uri,
  client: Client
) => Promise<Result<IUriResolver<unknown>[], TError | InfiniteLoopError>>;

export class UriResolverAggregator<
  TError = undefined
> extends UriResolverAggregatorBase<TError> {
  private resolvers:
    | IUriResolver<unknown>[]
    | GetResolversFunc
    | GetResolversWithErrorFunc<TError>;

  constructor(
    resolvers: UriResolverLike[],
    options?: UriResolverAggregatorOptions
  );
  constructor(
    resolvers: (
      uri: Uri,
      client: Client
    ) => Promise<Result<IUriResolver<unknown>[], TError | InfiniteLoopError>>,
    options?: UriResolverAggregatorOptions
  );
  constructor(
    resolvers: GetResolversFunc,
    options?: UriResolverAggregatorOptions
  );
  constructor(
    resolvers:
      | UriResolverLike[]
      | GetResolversFunc
      | GetResolversWithErrorFunc<TError>,
    options: UriResolverAggregatorOptions = { endOnRedirect: false }
  ) {
    super(options);
    if (Array.isArray(resolvers)) {
      this.resolvers = resolvers.map((x) => buildUriResolver(x));
    } else {
      this.resolvers = resolvers;
    }
  }

  async getUriResolvers(
    uri: Uri,
    client: Client
  ): Promise<Result<IUriResolver<unknown>[], TError | InfiniteLoopError>> {
    if (Array.isArray(this.resolvers)) {
      return ResultOk(this.resolvers);
    } else {
      const result = await this.resolvers(uri, client);

      if (Array.isArray(result)) {
        return ResultOk(result);
      } else {
        return result;
      }
    }
  }
}
