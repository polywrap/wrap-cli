import { UriResolverAggregator } from ".";
import {
  IUriResolver,
  Uri,
  Client,
  WrapperCache,
  IUriResolutionError,
} from "../..";
import { UriResolvable } from "./UriResolvable";

export const buildUriResolver = (
  resolvable: UriResolvable,
  options: { fullResolution: boolean } = { fullResolution: false }
): IUriResolver => {
  if (Array.isArray(resolvable)) {
    return new UriResolverAggregator(
      (resolvable as UriResolvable[]).map((x) => buildUriResolver(x, options)),
      options
    );
  } else if (typeof resolvable === "function") {
    return new UriResolverAggregator(
      resolvable as (
        uri: Uri,
        client: Client,
        cache: WrapperCache
      ) => Promise<IUriResolver[] | IUriResolutionError>,
      options
    );
  } else if ((resolvable as IUriResolver).tryResolveToWrapper !== undefined) {
    return resolvable as IUriResolver;
  } else {
    throw new Error("Unknown resolvable type");
  }
};
