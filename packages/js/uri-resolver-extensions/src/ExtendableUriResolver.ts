import { UriResolverWrapper } from "./UriResolverWrapper";

import {
  Uri,
  Client,
  IUriResolver,
  getImplementations,
  coreInterfaceUris,
  UriResolutionResponse,
  IUriResolutionResponse,
} from "@polywrap/core-js";
import { Result, ResultOk } from "@polywrap/result";
import {
  InfiniteLoopError,
  UriResolverAggregatorBase,
} from "@polywrap/uri-resolvers-js";

export class ExtendableUriResolver extends UriResolverAggregatorBase<unknown> {
  constructor(options: { endOnRedirect: boolean }) {
    super(options);
  }

  get name(): string {
    return "ExtendableUriResolver";
  }

  async getUriResolvers(
    uri: Uri,
    client: Client
  ): Promise<Result<IUriResolver<unknown>[]>> {
    const uriResolverImpls = getImplementations(
      coreInterfaceUris.uriResolver,
      client.getInterfaces({}),
      client.getRedirects({})
    );

    const resolvers: UriResolverWrapper[] = uriResolverImpls.map(
      (implementationUri) => new UriResolverWrapper(implementationUri)
    );

    return ResultOk(resolvers);
  }

  private resolverIndex = -1;

  async tryResolveUri(
    uri: Uri,
    client: Client
  ): Promise<IUriResolutionResponse<InfiniteLoopError | unknown>> {
    const result = await this.getUriResolvers(uri, client);
    const resolvers = (result as {
      ok: true;
      value: UriResolverWrapper[];
    }).value;

    this.resolverIndex++;

    if (this.resolverIndex >= resolvers.length) {
      this.resolverIndex = -1;
      return UriResolutionResponse.ok(uri);
    }

    try {
      const result = await super.tryResolveUriWithResolvers(
        uri,
        client,
        resolvers
          .slice(this.resolverIndex, resolvers.length)
          .filter((x) => x.implementationUri.uri !== uri.uri)
      );

      this.resolverIndex = -1;
      return result;
    } catch (ex) {
      this.resolverIndex = -1;
      throw ex;
    }
  }
}