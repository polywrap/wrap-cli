import { UriResolverAggregatorBase } from "./UriResolverAggregatorBase";
import { UriResolver, UriResolverLike } from "../helpers";

import { Result, ResultOk } from "@polywrap/result";
import { IUriResolver, Uri, CoreClient } from "@polywrap/core-js";

export type GetResolversFunc = (
  uri: Uri,
  client: CoreClient
) => Promise<IUriResolver<unknown>[]>;

export type GetResolversWithErrorFunc<TError> = (
  uri: Uri,
  client: CoreClient
) => Promise<Result<IUriResolver<unknown>[], TError>>;

export class UriResolverAggregator<
  TResolutionError = undefined,
  TGetResolversError = undefined
> extends UriResolverAggregatorBase<TResolutionError, TGetResolversError> {
  private resolvers:
    | IUriResolver<unknown>[]
    | GetResolversFunc
    | GetResolversWithErrorFunc<TGetResolversError>;

  constructor(resolvers: UriResolverLike[], resolverName?: string);
  constructor(
    resolvers: (
      uri: Uri,
      client: CoreClient
    ) => Promise<Result<IUriResolver<unknown>[], TGetResolversError>>,
    resolverName?: string
  );
  constructor(resolvers: GetResolversFunc, resolverName?: string);
  constructor(
    resolvers:
      | UriResolverLike[]
      | GetResolversFunc
      | GetResolversWithErrorFunc<TGetResolversError>,
    private resolverName?: string
  ) {
    super();
    if (Array.isArray(resolvers)) {
      this.resolvers = resolvers.map((x) => UriResolver.from(x));
    } else {
      this.resolvers = resolvers;
    }
  }

  async getUriResolvers(
    uri: Uri,
    client: CoreClient
  ): Promise<Result<IUriResolver<unknown>[], TGetResolversError>> {
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

  protected getStepDescription = (): string =>
    `${this.resolverName ?? "UriResolverAggregator"}`;
}
