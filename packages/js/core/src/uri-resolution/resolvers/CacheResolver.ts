import {
  IUriResolver,
  Uri,
  Client,
  WrapperCache,
  IUriResolutionResult,
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
  ): Promise<IUriResolutionResult> {
    const wrapper = cache.get(uri.uri);

    return {
      response: wrapper
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
