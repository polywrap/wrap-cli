import { UriResolverWrapper } from "./UriResolverWrapper";

import {
  Uri,
  Client,
  IUriResolver,
  getImplementations,
  coreInterfaceUris,
  IUriResolutionContext,
  UriResolutionContext,
  UriPackageOrWrapper,
  UriResolutionResult,
} from "@polywrap/core-js";
import { Result, ResultOk } from "@polywrap/result";
import {
  InfiniteLoopError,
  UriResolverAggregatorBase,
} from "@polywrap/uri-resolvers-js";

export class ExtendableUriResolver extends UriResolverAggregatorBase<unknown> {
  loadingExtensionsMap: Map<number, Map<string, boolean>> = new Map();

  constructor(options?: { resolverName?: string; fullResolution?: boolean }) {
    super(
      options?.resolverName ?? "ExtendableUriResolver",
      options?.fullResolution
    );
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

    const definedResolutionContext = resolutionContext as UriResolutionContext;

    const resolvers: UriResolverWrapper[] = uriResolverImpls
      .filter((x) => !definedResolutionContext.hasVisited(x))
      .map((implementationUri) => new UriResolverWrapper(implementationUri));

    return ResultOk(resolvers);
  }

  async tryResolveUri(
    uri: Uri,
    client: Client,
    resolutionContext?: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, InfiniteLoopError | unknown>> {
    if (!resolutionContext) {
      resolutionContext = new UriResolutionContext();
    }
    resolutionContext.visit(uri);

    const result = await this.getUriResolvers(uri, client, resolutionContext);
    const resolvers = (result as {
      ok: true;
      value: UriResolverWrapper[];
    }).value;

    if (resolvers.length === 0) {
      resolutionContext.unvisit(uri);
      return UriResolutionResult.ok(uri);
    }

    try {
      const result = await super.tryResolveUriWithResolvers(
        uri,
        client,
        resolvers,
        resolutionContext
      );

      resolutionContext.unvisit(uri);
      return result;
    } catch (ex) {
      resolutionContext.unvisit(uri);
      throw ex;
    }
  }
}
