import { UriResolverAggregator } from ".";
import { IUriResolver, Uri, Client, WrapperCache, Result } from "../..";
import { UriResolvable } from "./UriResolvable";

export const buildUriResolver = (
  resolvable: UriResolvable,
  options: { fullResolution: boolean } = { fullResolution: false }
): IUriResolver<unknown> => {
  if (Array.isArray(resolvable)) {
    return new UriResolverAggregator<unknown>(
      (resolvable as UriResolvable[]).map((x) => buildUriResolver(x, options)),
      options
    );
  } else if (typeof resolvable === "function") {
    return new UriResolverAggregator(
      resolvable as (
        uri: Uri,
        client: Client,
        cache: WrapperCache
      ) => Promise<Result<IUriResolver[], unknown>>,
      options
    );
  } else if ((resolvable as IUriResolver).tryResolveToWrapper !== undefined) {
    return resolvable as IUriResolver;
  } else {
    throw new Error("Unknown resolvable type");
  }
};
