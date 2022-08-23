import { IUriResolver, Uri, Client, Result } from "@polywrap/core-js";
import {
  UriResolvable,
  UriResolverAggregatorOptions,
  UriResolverAggregator,
} from ".";

export const buildUriResolver = <TError = undefined>(
  resolvable: UriResolvable,
  options: UriResolverAggregatorOptions = {
    fullResolution: false,
  }
): IUriResolver<TError> => {
  if (Array.isArray(resolvable)) {
    return new UriResolverAggregator(
      (resolvable as UriResolvable[]).map((x) => buildUriResolver(x, options)),
      options
    ) as IUriResolver<TError>;
  } else if (typeof resolvable === "function") {
    return new UriResolverAggregator(
      resolvable as (
        uri: Uri,
        client: Client
      ) => Promise<Result<IUriResolver[], unknown>>,
      options
    ) as IUriResolver<TError>;
  } else if ((resolvable as IUriResolver).tryResolveUri !== undefined) {
    return resolvable as IUriResolver<TError>;
  } else {
    throw new Error("Unknown resolvable type");
  }
};
