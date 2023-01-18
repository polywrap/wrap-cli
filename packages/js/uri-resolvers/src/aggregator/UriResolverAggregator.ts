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
  private _resolvers:
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
    private _resolverName?: string
  ) {
    super();
    if (Array.isArray(resolvers)) {
      this._resolvers = resolvers.map((x) => UriResolver.from(x));
    } else {
      this._resolvers = resolvers;
    }
  }

  async getUriResolvers(
    uri: Uri,
    client: CoreClient
  ): Promise<Result<IUriResolver<unknown>[], TGetResolversError>> {
    if (Array.isArray(this._resolvers)) {
      return ResultOk(this._resolvers);
    } else {
      const result = await this._resolvers(uri, client);

      if (Array.isArray(result)) {
        return ResultOk(result);
      } else {
        return result;
      }
    }
  }

  protected getStepDescription = (): string =>
    `${this._resolverName ?? "UriResolverAggregator"}`;
}
