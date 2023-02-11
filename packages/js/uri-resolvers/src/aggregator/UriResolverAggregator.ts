import { UriResolverAggregatorBase } from "./UriResolverAggregatorBase";
import { UriResolver, UriResolverLike } from "../helpers";

import { Result, ResultOk } from "@polywrap/result";
import { IUriResolver, Uri, CoreClient } from "@polywrap/core-js";

// $start: UriResolverAggregator-GetResolversFunc
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
// $end

// $start: UriResolverAggregator-GetResolversWithErrorFunc
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
// $end

// $start: UriResolverAggregator
/**
 * An implementation of UriResolverAggregatorBase
 */
export class UriResolverAggregator<
  TResolutionError = undefined,
  TGetResolversError = undefined
> extends UriResolverAggregatorBase<
  TResolutionError,
  TGetResolversError
> /* $ */ {
  private _resolvers:
    | IUriResolver<unknown>[]
    | GetResolversFunc
    | GetResolversWithErrorFunc<TGetResolversError>;

  // $start: UriResolverAggregator-constructor
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
  ) /* $ */ {
    super();
    if (Array.isArray(resolvers)) {
      this._resolvers = resolvers.map((x) => UriResolver.from(x));
    } else {
      this._resolvers = resolvers;
    }
  }

  // $start: UriResolverAggregator-getUriResolvers
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
  ): Promise<Result<IUriResolver<unknown>[], TGetResolversError>> /* $ */ {
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

  // $start: UriResolverAggregator-getStepDescription
  /**
   * A utility function for generating step descriptions to facilitate resolution context updates
   *
   * @returns text describing the URI resolution step
   * */
  protected getStepDescription = (): string /* $ */ =>
    `${this._resolverName ?? "UriResolverAggregator"}`;
}
