import {
  IUriResolutionResponse,
  Uri,
  Client,
  Result,
  IUriResolver,
  getImplementations,
  coreInterfaceUris,
  Ok,
  UriResolutionResponse,
} from "@polywrap/core-js";
import { DeserializeManifestOptions } from "@polywrap/wrap-manifest-types-js";
import { CreateWrapperFunc } from "./types/CreateWrapperFunc";
import {
  InfiniteLoopError,
  UriResolverAggregatorBase,
  UriResolverWrapper,
} from "..";

export type ExtendableUriResolverResponse = IUriResolutionResponse<
  LoadResolverExtensionsError | InfiniteLoopError
>;

export class LoadResolverExtensionsError {
  readonly message: string;

  constructor(public readonly failedUriResolvers: string[]) {
    this.message = `Could not load the following URI Resolver implementations: ${failedUriResolvers}`;
  }
}

export class ExtendableUriResolver extends UriResolverAggregatorBase<LoadResolverExtensionsError> {
  constructor(
    options: { fullResolution: boolean },
    private readonly _createWrapper: CreateWrapperFunc,
    private _deserializeOptions?: DeserializeManifestOptions
  ) {
    super(options);
  }

  get name(): string {
    return ExtendableUriResolver.name;
  }

  async getUriResolvers(
    uri: Uri,
    client: Client
  ): Promise<Result<IUriResolver<unknown>[], LoadResolverExtensionsError>> {
    const uriResolverImpls = getImplementations(
      coreInterfaceUris.uriResolver,
      client.getInterfaces({}),
      client.getRedirects({})
    );

    const resolvers: UriResolverWrapper[] = await this._createUriResolverWrappers(
      uriResolverImpls
    );

    return Ok(resolvers);
  }

  private resolverIndex = -1;

  async tryResolveToWrapper(
    uri: Uri,
    client: Client
  ): Promise<ExtendableUriResolverResponse> {
    const result = await this.getUriResolvers(uri, client);

    if (!result.ok) {
      return UriResolutionResponse.err(result.error);
    }

    const resolvers = result.value as UriResolverWrapper[];

    this.resolverIndex++;

    if (this.resolverIndex >= resolvers.length) {
      this.resolverIndex = -1;
      return UriResolutionResponse.ok(uri);
    }

    try {
      const result = await super.tryResolveToWrapperWithResolvers(
        uri,
        client,
        resolvers
          .slice(this.resolverIndex, resolvers.length)
          .filter((x) => x.implementationUri.uri !== uri.uri)
      );

      this.resolverIndex = -1;
      return result;
    } catch (ex) {
      console.log("THROOOOWN", ex);
      this.resolverIndex = -1;
      throw ex;
    }
  }

  private async _createUriResolverWrappers(
    implementationUris: Uri[]
  ): Promise<UriResolverWrapper[]> {
    const uriResolverImpls: UriResolverWrapper[] = [];

    for (const implementationUri of implementationUris) {
      const uriResolverImpl = new UriResolverWrapper(
        implementationUri,
        this._createWrapper,
        this._deserializeOptions
      );

      uriResolverImpls.push(uriResolverImpl);
    }

    return uriResolverImpls;
  }
}
