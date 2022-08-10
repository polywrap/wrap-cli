import { Uri, Client, WrapperCache, IUriResolver } from "../../..";
import { UriResolverAggregatorBase } from "./UriResolverAggregatorBase";

export class UriResolverAggregator<
  TError = undefined
> extends UriResolverAggregatorBase<TError> {
  constructor(resolvers: IUriResolver[], options: { fullResolution: boolean });
  constructor(
    resolvers: (
      uri: Uri,
      client: Client,
      cache: WrapperCache
    ) => Promise<{
      resolvers?: IUriResolver[];
      error?: TError;
    }>,
    options: { fullResolution: boolean }
  );
  constructor(
    resolvers: (
      uri: Uri,
      client: Client,
      cache: WrapperCache
    ) => Promise<IUriResolver[]>,
    options: { fullResolution: boolean }
  );
  constructor(
    private resolvers:
      | IUriResolver[]
      | ((
          uri: Uri,
          client: Client,
          cache: WrapperCache
        ) => Promise<IUriResolver[]>)
      | ((
          uri: Uri,
          client: Client,
          cache: WrapperCache
        ) => Promise<{
          resolvers?: IUriResolver[];
          error?: TError;
        }>),
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
  ): Promise<{
    resolvers?: IUriResolver[];
    error?: TError;
  }> {
    if (Array.isArray(this.resolvers)) {
      return {
        resolvers: this.resolvers,
      };
    } else {
      const result = await this.resolvers(uri, client, cache);

      if (Array.isArray(result)) {
        return {
          resolvers: result,
        };
      } else {
        return result;
      }
    }
  }
}
