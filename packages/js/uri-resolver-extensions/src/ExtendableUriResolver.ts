import { UriResolverWrapper } from "./UriResolverWrapper";

import {
  Uri,
  Client,
  IUriResolver,
  getImplementations,
  coreInterfaceUris,
  IUriResolutionContext,
  UriPackageOrWrapper,
  UriResolutionResult,
} from "@polywrap/core-js";
import { Result, ResultOk } from "@polywrap/result";
import { UriResolverAggregatorBase } from "@polywrap/uri-resolvers-js";

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
    client: Client,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<IUriResolver<unknown>[], Error>> {
    const getImplementationsResult = getImplementations(
      coreInterfaceUris.uriResolver,
      client.getInterfaces(),
      client.getRedirects()
    );

    if (!getImplementationsResult.ok) {
      return getImplementationsResult;
    }

    const uriResolverImpls = getImplementationsResult.value;

    const resolvers: UriResolverWrapper[] = uriResolverImpls
      .filter((x) => !resolutionContext.isResolving(x))
      .map((implementationUri) => new UriResolverWrapper(implementationUri));

    return ResultOk(resolvers);
  }

  async tryResolveUri(
    uri: Uri,
    client: Client,
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
