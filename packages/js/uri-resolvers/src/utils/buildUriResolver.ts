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
    const uriPackage = resolvable as IUriPackage;
    return (new PackageResolver(
      uriPackage.uri,
      uriPackage.package
    ) as unknown) as IUriResolver<TError>;
  } else if ((resolvable as IUriResolver).tryResolveUri !== undefined) {
    return resolvable as IUriResolver<TError>;
  } else if (
    (resolvable as PackageRegistration).uri !== undefined &&
    (resolvable as PackageRegistration).package !== undefined
  ) {
    const uriPackage = resolvable as PackageRegistration;
    return (new PackageResolver(
      toUri(uriPackage.uri),
      uriPackage.package
    ) as unknown) as IUriResolver<TError>;
  } else if (
    (resolvable as WrapperRegistration).uri !== undefined &&
    (resolvable as WrapperRegistration).wrapper !== undefined
  ) {
    const uriWrapper = resolvable as WrapperRegistration;
    return (new WrapperResolver(
      toUri(uriWrapper.uri),
      uriWrapper.wrapper
    ) as unknown) as IUriResolver<TError>;
  } else {
    throw new Error("Unknown resolvable type");
  }
};
