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

export class StaticResolver<TError = undefined>
  implements IUriResolver<TError> {
  constructor(public uriMap: Map<string, UriPackageOrWrapper>) {}

  static from<TError = undefined>(
    staticResolverLikes: UriResolverLike[]
  ): StaticResolver<TError> {
    const uriMap = new Map<string, UriPackageOrWrapper>();
    for (const staticResolverLike of staticResolverLikes) {
      if (Array.isArray(staticResolverLike)) {
        const resolver = StaticResolver.from(staticResolverLike);
        for (const [uri, uriPackageOrWrapper] of resolver.uriMap) {
          uriMap.set(uri, uriPackageOrWrapper);
        }
      } else if (
        (staticResolverLike as IUriRedirect).from !== undefined &&
        (staticResolverLike as IUriRedirect).to !== undefined
      ) {
        const uriRedirect = staticResolverLike as IUriRedirect;
        const from = Uri.from(uriRedirect.from);

        uriMap.set(from.uri, {
          type: "uri",
          uri: Uri.from(uriRedirect.to),
        });
      } else if (
        (staticResolverLike as IUriPackage).uri !== undefined &&
        (staticResolverLike as IUriPackage).package !== undefined
      ) {
        const uriPackage = staticResolverLike as IUriPackage;
        const uri = Uri.from(uriPackage.uri);

        uriMap.set(uri.uri, {
          type: "package",
          uri,
          package: uriPackage.package,
        });
      } else if (
        (staticResolverLike as IUriWrapper).uri !== undefined &&
        (staticResolverLike as IUriWrapper).wrapper !== undefined
      ) {
        const uriWrapper = staticResolverLike as IUriWrapper;
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

  async tryResolveUri(
    uri: Uri,
    _: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>> {
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
