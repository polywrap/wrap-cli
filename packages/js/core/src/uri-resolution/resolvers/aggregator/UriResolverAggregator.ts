import {
  Uri,
  Client,
  WrapperCache,
  IUriResolutionError,
  IUriResolver,
} from "../../..";
import {
  UriResolverAggregatorBase,
  UriResolverAggregatorError,
} from "./UriResolverAggregatorBase";

export class UriResolverAggregator<
  TError extends IUriResolutionError = UriResolverAggregatorError
> extends UriResolverAggregatorBase<TError> {
  constructor(resolvers: IUriResolver[], options: { fullResolution: boolean });
  constructor(
    resolvers: (
      uri: Uri,
      client: Client,
      cache: WrapperCache
    ) => Promise<IUriResolver[] | IUriResolutionError>,
    options: { fullResolution: boolean }
  );
  constructor(
    private resolvers:
      | IUriResolver[]
      | ((
          uri: Uri,
          client: Client,
          cache: WrapperCache
        ) => Promise<IUriResolver[] | IUriResolutionError>),
    options: { fullResolution: boolean }
  ) {
    super(options);
  }

  get name(): string {
    return UriResolverAggregator.name;
  }

  async getUriResolvers(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<IUriResolver[] | IUriResolutionError> {
    if (Array.isArray(this.resolvers)) {
      return this.resolvers;
    } else {
      return await this.resolvers(uri, client, cache);
    }
  }
}
