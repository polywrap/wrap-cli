import {
  UriResolverLike,
  UriResolverAggregatorOptions,
  UriResolverAggregator,
} from ".";

import { IUriResolver, Uri, Client } from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export const buildUriResolver = <TError = undefined>(
  resolvable: UriResolverLike,
  options: UriResolverAggregatorOptions = {
    endOnRedirect: false,
  }
): IUriResolver<TError> => {
  if (Array.isArray(resolvable)) {
    return new UriResolverAggregator(
      (resolvable as UriResolverLike[]).map((x) =>
        buildUriResolver(x, options)
      ),
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
