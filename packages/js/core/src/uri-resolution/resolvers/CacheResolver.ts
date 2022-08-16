import {
  IUriResolver,
  Uri,
  Client,
  WrapperCache,
  IUriResolutionResponse,
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
  ): Promise<IUriResolutionResponse> {
    const wrapper = cache.get(uri.uri);

    return {
      result: wrapper
        ? Ok({
            type: "wrapper",
            wrapper,
          })
        : Ok({
            type: "uri",
            uri,
          }),
    };
  }
}
