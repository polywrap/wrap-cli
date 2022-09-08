import {
  Uri,
  Client,
  WrapperCache,
  executeMaybeAsyncFunction,
  Wrapper,
} from "../../../types";
import { UriResolver, UriResolutionResult } from "../../core";

export class CacheResolver implements UriResolver {
  public get name(): string {
    return "CacheResolver";
  }

  public async resolveUri(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<UriResolutionResult> {
    const wrapper = await executeMaybeAsyncFunction<Wrapper | undefined>(
      cache.get.bind(cache, uri)
    );

    return Promise.resolve({
      uri: uri,
      wrapper: wrapper,
    });
  }
}
