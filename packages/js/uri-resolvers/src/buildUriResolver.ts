import { UriResolverLike, UriResolverAggregator, PackageResolver } from ".";

import { IUriResolver, Uri, Client, IWrapPackage } from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export const buildUriResolver = <TError = undefined>(
  resolvable: UriResolverLike,
  resolverName?: string
): IUriResolver<TError> => {
  if (Array.isArray(resolvable)) {
    return new UriResolverAggregator(
      (resolvable as UriResolverLike[]).map((x) =>
        buildUriResolver(x, resolverName)
      ),
      resolverName
    ) as IUriResolver<TError>;
  } else if (typeof resolvable === "function") {
    return new UriResolverAggregator(
      resolvable as (
        uri: Uri,
        client: Client
      ) => Promise<Result<IUriResolver[], unknown>>,
      resolverName
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
