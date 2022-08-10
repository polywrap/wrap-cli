import {
  IUriResolver,
  Uri,
  Client,
  WrapperCache,
  UriResolutionResult,
  Result,
  Ok,
} from "../..";

export class CacheResolver implements IUriResolver {
  public get name(): string {
    return CacheResolver.name;
  }

  public async tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<Result<UriResolutionResult>> {
    const wrapper = cache.get(uri.uri);

    return wrapper
      ? Ok(new UriResolutionResult(wrapper))
      : Ok(new UriResolutionResult(uri));
  }
}
