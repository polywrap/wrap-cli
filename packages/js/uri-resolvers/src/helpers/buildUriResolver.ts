import { UriResolverAggregator } from "../aggregator";
import { PackageResolver } from "../packages";
import { WrapperResolver } from "../wrappers";
import {
  PackageRegistration,
  WrapperRegistration,
  UriResolverLike,
} from "../helpers";
import { RedirectResolver } from "../redirects";

import { Result } from "@polywrap/result";
import { IUriResolver, Uri, Client, UriRedirect } from "@polywrap/core-js";

export const buildUriResolver = <TError = undefined>(
  resolverLike: UriResolverLike,
  resolverName?: string
): IUriResolver<TError> => {
  if (Array.isArray(resolverLike)) {
    return new UriResolverAggregator(
      (resolverLike as UriResolverLike[]).map((x) =>
        buildUriResolver(x, resolverName)
      ),
      resolverName
    ) as IUriResolver<TError>;
  } else if (typeof resolverLike === "function") {
    return new UriResolverAggregator(
      resolverLike as (
        uri: Uri,
        client: Client
      ) => Promise<Result<IUriResolver[], unknown>>,
      resolverName
    ) as IUriResolver<TError>;
  } else if ((resolverLike as IUriResolver).tryResolveUri !== undefined) {
    return resolverLike as IUriResolver<TError>;
  } else if (
    (resolverLike as UriRedirect<string | Uri>).from !== undefined &&
    (resolverLike as UriRedirect<string | Uri>).to !== undefined
  ) {
    const uriRedirect = resolverLike as UriRedirect<string | Uri>;
    return (new RedirectResolver(
      uriRedirect.from,
      uriRedirect.to
    ) as unknown) as IUriResolver<TError>;
  } else if (
    (resolverLike as PackageRegistration).uri !== undefined &&
    (resolverLike as PackageRegistration).package !== undefined
  ) {
    const uriPackage = resolverLike as PackageRegistration;
    return (new PackageResolver(
      Uri.from(uriPackage.uri),
      uriPackage.package
    ) as unknown) as IUriResolver<TError>;
  } else if (
    (resolverLike as WrapperRegistration).uri !== undefined &&
    (resolverLike as WrapperRegistration).wrapper !== undefined
  ) {
    const uriWrapper = resolverLike as WrapperRegistration;
    return (new WrapperResolver(
      Uri.from(uriWrapper.uri),
      uriWrapper.wrapper
    ) as unknown) as IUriResolver<TError>;
  } else {
    throw new Error("Unknown resolver-like type");
  }
};
