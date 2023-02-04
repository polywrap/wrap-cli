import { UriResolverAggregator } from "../aggregator";
import { PackageResolver } from "../packages";
import { WrapperResolver } from "../wrappers";
import { UriResolverLike } from ".";
import { RedirectResolver } from "../redirects";

import { Result } from "@polywrap/result";
import {
  IUriResolver,
  Uri,
  CoreClient,
  IUriRedirect,
  IUriPackage,
  IUriWrapper,
} from "@polywrap/core-js";

export class UriResolver {
  static from<TError = undefined>(
    resolverLike: UriResolverLike,
    resolverName?: string
  ): IUriResolver<TError> {
    if (Array.isArray(resolverLike)) {
      return new UriResolverAggregator(
        (resolverLike as UriResolverLike[]).map((x) =>
          UriResolver.from(x, resolverName)
        ),
        resolverName
      ) as IUriResolver<TError>;
    } else if (typeof resolverLike === "function") {
      return new UriResolverAggregator(
        resolverLike as (
          uri: Uri,
          client: CoreClient
        ) => Promise<Result<IUriResolver[], unknown>>,
        resolverName
      ) as IUriResolver<TError>;
    } else if ((resolverLike as IUriResolver).tryResolveUri !== undefined) {
      return resolverLike as IUriResolver<TError>;
    } else if (
      (resolverLike as IUriRedirect).from !== undefined &&
      (resolverLike as IUriRedirect).to !== undefined
    ) {
      const uriRedirect = resolverLike as IUriRedirect;
      return (new RedirectResolver(
        uriRedirect.from,
        uriRedirect.to
      ) as unknown) as IUriResolver<TError>;
    } else if (
      (resolverLike as IUriPackage).uri !== undefined &&
      (resolverLike as IUriPackage).package !== undefined
    ) {
      const uriPackage = resolverLike as IUriPackage;
      return (new PackageResolver(
        Uri.from(uriPackage.uri),
        uriPackage.package
      ) as unknown) as IUriResolver<TError>;
    } else if (
      (resolverLike as IUriWrapper).uri !== undefined &&
      (resolverLike as IUriWrapper).wrapper !== undefined
    ) {
      const uriWrapper = resolverLike as IUriWrapper;
      return (new WrapperResolver(
        Uri.from(uriWrapper.uri),
        uriWrapper.wrapper
      ) as unknown) as IUriResolver<TError>;
    } else {
      throw new Error("Unknown resolver-like type");
    }
  }
}
