import { UriResolverWrapper } from "./UriResolverWrapper";

import {
  Uri,
  WrapClient,
  UriResolver,
  UriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/wrap-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";
import {
  UriResolverAggregatorBase,
  UriResolutionResult,
} from "@polywrap/uri-resolvers-js";

// $start: ExtendableUriResolver
/**
 * A Uri Resolver that delegates resolution to wrappers implementing the
 * URI Resolver Extension Interface.
 * */
export class ExtendableUriResolver extends UriResolverAggregatorBase<
  Error,
  Error
> /* $ */ {
  // $start: ExtendableUriResolver-extInterfaceUri-static
  /** The supported interface URIs to which resolver-ext implementations should be registered */
  public static defaultExtInterfaceUris: Uri[] = [
    Uri.from("wrap://ens/wraps.eth:uri-resolver-ext@1.1.0"),
    Uri.from("wrap://ens/wraps.eth:uri-resolver-ext@1.0.0"),
  ];
  // $end

  // $start: ExtendableUriResolver-extInterfaceUri
  /** The active interface URIs to which implementations should be registered */
  public readonly extInterfaceUris: Uri[];
  // $end
  private readonly _resolverName: string;

  // $start: ExtendableUriResolver-constructor
  /**
   * Create an ExtendableUriResolver
   *
   * @param extInterfaceUris - URI Resolver Interface URIs
   * @param resolverName - Name to use in resolution history output
   * */
  constructor(
    extInterfaceUris: Uri[] = ExtendableUriResolver.defaultExtInterfaceUris,
    resolverName = "ExtendableUriResolver"
  ) /* $ */ {
    super();
    this.extInterfaceUris = extInterfaceUris;
    this._resolverName = resolverName;
  }

  // $start: ExtendableUriResolver-getUriResolvers
  /**
   * Get a list of URI Resolvers
   *
   * @param uri - the URI to query for resolvers
   * @param client - a CoreClient instance that can be used to make an invocation
   * @param resolutionContext - the current URI resolution context
   *
   * @returns a list of IUriResolver or an error
   * */
  async getUriResolvers(
    uri: Uri,
    client: WrapClient,
    resolutionContext: UriResolutionContext
  ): Promise<Result<UriResolver<unknown>[], Error>> /* $ */ {
    const uriResolverImpls: Uri[] = [];

    for (const extInterfaceUri of this.extInterfaceUris) {
      const getImplementationsResult = await client.getImplementations(
        extInterfaceUri,
        {
          resolutionContext: resolutionContext.createSubContext(),
        }
      );

      if (!getImplementationsResult.ok) {
        return ResultErr(getImplementationsResult.error);
      }

      uriResolverImpls.push(...getImplementationsResult.value);
    }

    const resolvers: UriResolverWrapper[] = uriResolverImpls
      .filter((x) => !resolutionContext.isResolving(x))
      .map((implementationUri) => new UriResolverWrapper(implementationUri));

    return ResultOk(resolvers);
  }

  // $start: ExtendableUriResolver-tryResolverUri
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * Attempts resolution with each the URI Resolver Extension wrappers sequentially.
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
  ): Promise<Result<UriPackageOrWrapper, Error>> /* $ */ {
    const result = await this.getUriResolvers(uri, client, resolutionContext);
    if (!result.ok) {
      return UriResolutionResult.err(result.error);
    }
    const resolvers = result.value as UriResolverWrapper[];

    if (resolvers.length === 0) {
      return UriResolutionResult.ok(uri);
    }

    return await super.tryResolveUriWithResolvers(
      uri,
      client,
      resolvers,
      resolutionContext
    );
  }

  // $start: ExtendableUriResolver-getStepDescription
  /**
   * A utility function for generating step descriptions to facilitate resolution context updates
   *
   * @returns text describing the URI resolution step
   * */
  protected getStepDescription = (): string /* $ */ => `${this._resolverName}`;
}
