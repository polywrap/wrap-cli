import { UriResolverWrapper } from "./UriResolverWrapper";

import {
  Uri,
  CoreClient,
  IUriResolver,
  coreInterfaceUris,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";
import {
  UriResolverAggregatorBase,
  UriResolutionResult,
} from "@polywrap/uri-resolvers-js";

export class ExtendableUriResolver extends UriResolverAggregatorBase<
  Error,
  Error
> {
  private readonly resolverName: string;

  constructor(resolverName?: string) {
    super();
    this.resolverName = resolverName ?? "ExtendableUriResolver";
  }

  async getUriResolvers(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<IUriResolver<unknown>[], Error>> {
    const getImplementationsResult = await client.getImplementations(
      coreInterfaceUris.uriResolver,
      {
        resolutionContext,
      }
    );

    if (!getImplementationsResult.ok) {
      return ResultErr(getImplementationsResult.error);
    }

    const uriResolverImpls = getImplementationsResult.value;

    const resolvers: UriResolverWrapper[] = uriResolverImpls
      .filter((x) => !resolutionContext.isResolving(x))
      .map((implementationUri) => new UriResolverWrapper(implementationUri));

    return ResultOk(resolvers);
  }

  async tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, Error>> {
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

  protected getStepDescription = (): string => `${this.resolverName}`;
}
