import {
  Uri,
  Client,
  WrapperCache,
  IUriResolver,
  InfiniteLoopError,
  Result,
  Ok,
} from "../../..";
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
    ) => Promise<Result<IUriResolver[], TError | InfiniteLoopError>>,
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
        ) => Promise<Result<IUriResolver[], TError | InfiniteLoopError>>),
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
  ): Promise<Result<IUriResolver[], TError | InfiniteLoopError>> {
    if (Array.isArray(this.resolvers)) {
      return Ok(this.resolvers);
    } else {
      const result = await this.resolvers(uri, client, cache);

      if (Array.isArray(result)) {
        return Ok(result);
      } else {
        return result;
      }
    }
  }
}
