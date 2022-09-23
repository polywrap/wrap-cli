import { UriResolverAggregator } from "../aggregator";
import { UriResolverLike } from "../helpers";
import { PackageResolver } from "../packages";
import { WrapperResolver } from "../wrappers";

import { Result } from "@polywrap/result";
import {
  IUriResolver,
  Uri,
  Client,
  IWrapPackage,
  IUriPackage,
  toUri,
} from "@polywrap/core-js";
import { PackageRegistration } from "../helpers/PackageRegistration";
import { WrapperRegistration } from "../helpers/WrapperRegistration";

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
  } else if ((resolverLike as Partial<IWrapPackage>).createWrapper) {
    const uriPackage = resolverLike as IUriPackage;
    return (new PackageResolver(
      uriPackage.uri,
      uriPackage.package
    ) as unknown) as IUriResolver<TError>;
  } else if ((resolverLike as IUriResolver).tryResolveUri !== undefined) {
    return resolverLike as IUriResolver<TError>;
  } else if (
    (resolverLike as PackageRegistration).uri !== undefined &&
    (resolverLike as PackageRegistration).package !== undefined
  ) {
    const uriPackage = resolverLike as PackageRegistration;
    return (new PackageResolver(
      toUri(uriPackage.uri),
      uriPackage.package
    ) as unknown) as IUriResolver<TError>;
  } else if (
    (resolverLike as WrapperRegistration).uri !== undefined &&
    (resolverLike as WrapperRegistration).wrapper !== undefined
  ) {
    const uriWrapper = resolverLike as WrapperRegistration;
    return (new WrapperResolver(
      toUri(uriWrapper.uri),
      uriWrapper.wrapper
    ) as unknown) as IUriResolver<TError>;
  } else {
    throw new Error("Unknown resolver-like type");
  }
};
