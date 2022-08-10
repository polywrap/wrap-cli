import {
  IUriResolver,
  Uri,
  Client,
  WrapperCache,
  UriResolutionResult,
  Ok,
} from "../..";
import { UriResolutionResponse } from "../core/UriResolutionResponse";

export class CacheResolver implements IUriResolver {
  public get name(): string {
    return CacheResolver.name;
  }

  public async tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<UriResolutionResult> {
    const wrapper = cache.get(uri.uri);

    return {
      response: wrapper
        ? Ok(new UriResolutionResponse(wrapper))
        : Ok(new UriResolutionResponse(uri)),
    };
  }
}
