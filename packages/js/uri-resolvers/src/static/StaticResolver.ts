import { UriResolutionResult, UriResolverLike } from "../helpers";

import {
  CoreClient,
  IUriResolutionContext,
  IUriResolver,
  Uri,
  UriPackageOrWrapper,
  IUriRedirect,
  IUriPackage,
  IUriWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

// $start: StaticResolver
/**
 * An IUriResolver implementation that efficiently delegates URI resolution to
 * static resolvers--i.e. those that resolve to embedded URIs, Wrappers, and Packages
 * */
export class StaticResolver<TError = undefined>
  implements IUriResolver<TError> /* $ */ {
  // $start: StaticResolver-constructor
  /**
   * Construct a Static Resolver
   *
   * @param uriMap - a mapping of URI to embedded URI, package, or wrapper
   * */
  constructor(public uriMap: Map<string, UriPackageOrWrapper>) /* $ */ {}

  // $start: StaticResolver-from
  /**
   * Create a StaticResolver from a static-resolver-like object
   *
   * @param staticResolverLikes - an array of resolver-like objects to delegate resolution to
   *
   * @returns a StaticResolver
   * */
  static from<TError = undefined>(
    staticResolverLikes: UriResolverLike[]
  ): StaticResolver<TError> /* $ */ {
    const uriMap = new Map<string, UriPackageOrWrapper>();
    for (const staticResolverLike of staticResolverLikes) {
      if (Array.isArray(staticResolverLike)) {
        const resolver = StaticResolver.from(staticResolverLike);
        for (const [uri, uriPackageOrWrapper] of resolver.uriMap) {
          uriMap.set(uri, uriPackageOrWrapper);
        }
      } else if (
        (staticResolverLike as IUriRedirect<Uri | string>).from !== undefined &&
        (staticResolverLike as IUriRedirect<Uri | string>).to !== undefined
      ) {
        const uriRedirect = staticResolverLike as IUriRedirect<Uri | string>;
        const from = Uri.from(uriRedirect.from);

        uriMap.set(from.uri, {
          type: "uri",
          uri: Uri.from(uriRedirect.to),
        });
      } else if (
        (staticResolverLike as IUriPackage<Uri | string>).uri !== undefined &&
        (staticResolverLike as IUriPackage<Uri | string>).package !== undefined
      ) {
        const uriPackage = staticResolverLike as IUriPackage<Uri | string>;
        const uri = Uri.from(uriPackage.uri);

        uriMap.set(uri.uri, {
          type: "package",
          uri,
          package: uriPackage.package,
        });
      } else if (
        (staticResolverLike as IUriWrapper<Uri | string>).uri !== undefined &&
        (staticResolverLike as IUriWrapper<Uri | string>).wrapper !== undefined
      ) {
        const uriWrapper = staticResolverLike as IUriWrapper<Uri | string>;
        const uri = Uri.from(uriWrapper.uri);

        uriMap.set(uri.uri, {
          type: "wrapper",
          uri,
          wrapper: uriWrapper.wrapper,
        });
      } else {
        throw new Error("Unknown static-resolver-like type provided.");
      }
    }

    return new StaticResolver(uriMap);
  }

  // $start: StaticResolver-tryResolveUri
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   *
   * @param uri - the URI to resolve
   * @param _ - not used
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  async tryResolveUri(
    uri: Uri,
    _: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>> /* $ */ {
    const uriPackageOrWrapper = this.uriMap.get(uri.uri);

    let result: Result<UriPackageOrWrapper, TError>;
    let description = "";

    if (uriPackageOrWrapper) {
      result = UriResolutionResult.ok(uriPackageOrWrapper);
      switch (uriPackageOrWrapper.type) {
        case "package":
          description = `StaticResolver - Package (${uri.uri})`;
          break;
        case "wrapper":
          description = `StaticResolver - Wrapper (${uri.uri})`;
          break;
        case "uri":
          description = `StaticResolver - Redirect (${uri.uri} - ${uriPackageOrWrapper.uri.uri})`;
          break;
      }
    } else {
      result = UriResolutionResult.ok(uri);
      description = `StaticResolver - Miss`;
    }

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      description,
    });

    return result;
  }
}
