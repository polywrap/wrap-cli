import { UriResolverAggregatorBase } from "./UriResolverAggregatorBase";
import { UriResolver, UriResolverLike } from "../helpers";

import { Result, ResultOk } from "@polywrap/result";
import { IUriResolver, Uri, CoreClient } from "@polywrap/core-js";

/**
 * A function that returns a list of resolvers
 *
 * @param uri - the URI to query
 * @param client - a CoreClient instance
 * */
export type GetResolversFunc = (
  uri: Uri,
  client: CoreClient
) => Promise<IUriResolver<unknown>[]>;

/**
 * A function that returns a list of resolvers or an error
 *
 * @param uri - the URI to query
 * @param client - a CoreClient instance
 * */
export type GetResolversWithErrorFunc<TError> = (
  uri: Uri,
  client: CoreClient
) => Promise<Result<IUriResolver<unknown>[], TError>>;

/**
 * An implementation of UriResolverAggregatorBase
 */
export class UriResolverAggregator<
  TResolutionError = undefined,
  TGetResolversError = undefined
> extends UriResolverAggregatorBase<TResolutionError, TGetResolversError> {
  private _resolvers:
    | IUriResolver<unknown>[]
    | GetResolversFunc
    | GetResolversWithErrorFunc<TGetResolversError>;

  /**
   * Creates a UriResolverAggregator from a list of resolvers, or from a function
   * that returns a list of resolvers
   * */
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

  /**
   * Get a list of URI Resolvers
   *
   * @param uri - the URI to query for resolvers
   * @param client - a CoreClient instance that can be used to make an invocation
   *
   * @returns a list of IUriResolver or an error
   * */
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
