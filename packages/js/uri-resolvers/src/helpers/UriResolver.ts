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

// $start: UriResolver
/** An IUriResolver factory */
export class UriResolver /* $ */ {
  // $start: UriResolver-from
  /**
   * Create an IUriResolver instance
   *
   * @param resolverLike - an object that can be transformed into a resolver
   * @param resolverName - a name to assign to the resolver in resolution history output
   * */
  static from<TError = undefined>(
    resolverLike: UriResolverLike,
    resolverName?: string
  ): IUriResolver<TError> /* $ */ {
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
      (resolverLike as IUriRedirect<Uri | string>).from !== undefined &&
      (resolverLike as IUriRedirect<Uri | string>).to !== undefined
    ) {
      const uriRedirect = resolverLike as IUriRedirect<Uri | string>;
      return (new RedirectResolver(
        uriRedirect.from,
        uriRedirect.to
      ) as unknown) as IUriResolver<TError>;
    } else if (
      (resolverLike as IUriPackage<Uri | string>).uri !== undefined &&
      (resolverLike as IUriPackage<Uri | string>).package !== undefined
    ) {
      const uriPackage = resolverLike as IUriPackage<Uri | string>;
      return (new PackageResolver(
        Uri.from(uriPackage.uri),
        uriPackage.package
      ) as unknown) as IUriResolver<TError>;
    } else if (
      (resolverLike as IUriWrapper<Uri | string>).uri !== undefined &&
      (resolverLike as IUriWrapper<Uri | string>).wrapper !== undefined
    ) {
      const uriWrapper = resolverLike as IUriWrapper<Uri | string>;
      return (new WrapperResolver(
        Uri.from(uriWrapper.uri),
        uriWrapper.wrapper
      ) as unknown) as IUriResolver<TError>;
    } else {
      throw new Error("Unknown resolver-like type");
    }
  }
}
