import { UriResolverAggregator } from "../aggregator";
import { PackageResolver } from "../packages";
import { WrapperResolver } from "../wrappers";
import { UriResolverLike } from ".";
import { RedirectResolver } from "../redirects";

import { Result } from "@polywrap/result";
import {
  UriResolver,
  Uri,
  WrapClient,
  UriRedirect,
  UriPackage,
  UriWrapper,
} from "@polywrap/wrap-js";

// $start: UriResolver
/** An IUriResolver factory */
export class UriResolverFactory /* $ */ {
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
  ): UriResolver<TError> /* $ */ {
    if (Array.isArray(resolverLike)) {
      return new UriResolverAggregator(
        (resolverLike as UriResolverLike[]).map((x) =>
          UriResolverFactory.from(x, resolverName)
        ),
        resolverName
      ) as UriResolver<TError>;
    } else if (typeof resolverLike === "function") {
      return new UriResolverAggregator(
        resolverLike as (
          uri: Uri,
          client: WrapClient
        ) => Promise<Result<UriResolver[], unknown>>,
        resolverName
      ) as UriResolver<TError>;
    } else if ((resolverLike as UriResolver).tryResolveUri !== undefined) {
      return resolverLike as UriResolver<TError>;
    } else if (
      (resolverLike as UriRedirect).from !== undefined &&
      (resolverLike as UriRedirect).to !== undefined
    ) {
      const uriRedirect = resolverLike as UriRedirect;
      return (new RedirectResolver(
        uriRedirect.from,
        uriRedirect.to
      ) as unknown) as UriResolver<TError>;
    } else if (
      (resolverLike as UriPackage).uri !== undefined &&
      (resolverLike as UriPackage).package !== undefined
    ) {
      const uriPackage = resolverLike as UriPackage;
      return (new PackageResolver(
        Uri.from(uriPackage.uri),
        uriPackage.package
      ) as unknown) as UriResolver<TError>;
    } else if (
      (resolverLike as UriWrapper).uri !== undefined &&
      (resolverLike as UriWrapper).wrapper !== undefined
    ) {
      const uriWrapper = resolverLike as UriWrapper;
      return (new WrapperResolver(
        Uri.from(uriWrapper.uri),
        uriWrapper.wrapper
      ) as unknown) as UriResolver<TError>;
    } else {
      throw new Error("Unknown resolver-like type");
    }
  }
}
