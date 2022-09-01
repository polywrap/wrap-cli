import {
  UriResolverLike,
  UriResolverAggregatorOptions,
  UriResolverAggregator,
  PackageResolver,
} from ".";

import { IUriResolver, Uri, Client, IWrapPackage } from "@polywrap/core-js";
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
  } else if ((resolvable as Partial<IWrapPackage>).createWrapper) {
    return (new PackageResolver(
      resolvable as IWrapPackage
    ) as unknown) as IUriResolver<TError>;
  } else if ((resolvable as IUriResolver).tryResolveUri !== undefined) {
    return resolvable as IUriResolver<TError>;
  } else {
    throw new Error("Unknown resolvable type");
  }
};
