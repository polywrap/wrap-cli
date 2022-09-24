import { UriResolverWrapper } from "./UriResolverWrapper";

import {
  Uri,
  Client,
  IUriResolver,
  getImplementations,
  coreInterfaceUris,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result, ResultOk } from "@polywrap/result";
import {
  UriResolverAggregatorBase,
  UriResolutionResult,
} from "@polywrap/uri-resolvers-js";

export class ExtendableUriResolver extends UriResolverAggregatorBase<unknown> {
  private readonly resolverName: string;

  constructor(resolverName?: string) {
    super();
    this.resolverName = resolverName ?? "ExtendableUriResolver";
  }

  async getUriResolvers(
    uri: Uri,
    client: Client,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<IUriResolver<unknown>[]>> {
    const uriResolverImpls = getImplementations(
      coreInterfaceUris.uriResolver,
      client.getInterfaces({}),
      client.getRedirects({})
    );

    const resolvers: UriResolverWrapper[] = uriResolverImpls
      .filter((x) => !resolutionContext.isResolving(x))
      .map((implementationUri) => new UriResolverWrapper(implementationUri));

    return ResultOk(resolvers);
  }

  async tryResolveUri(
    uri: Uri,
    client: Client,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, unknown>> {
    const result = await this.getUriResolvers(uri, client, resolutionContext);
    const resolvers = (result as {
      ok: true;
      value: UriResolverWrapper[];
    }).value;

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
