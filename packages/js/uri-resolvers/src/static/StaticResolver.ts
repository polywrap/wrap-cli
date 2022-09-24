import {
  PackageRegistration,
  UriResolutionResult,
  UriResolverLike,
  WrapperRegistration,
} from "../helpers";

import {
  IUriResolver,
  Uri,
  UriPackageOrWrapper,
  toUri,
  UriRedirect,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export class StaticResolver<TError = undefined>
  implements IUriResolver<TError> {
  constructor(public uriMap: Map<string, UriPackageOrWrapper>) {}

  static from<TError = undefined>(
    staticResolverLikes: UriResolverLike[],
    resolverName?: string
  ): StaticResolver<TError> {
    const uriMap = new Map<string, UriPackageOrWrapper>();
    for (const staticResolverLike of staticResolverLikes) {
      if (Array.isArray(staticResolverLike)) {
        const resolver = StaticResolver.from(staticResolverLike);
        for (const [uri, uriPackageOrWrapper] of resolver.uriMap) {
          uriMap.set(uri, uriPackageOrWrapper);
        }
      } else if (
        (staticResolverLike as UriRedirect<string | Uri>).from !== undefined &&
        (staticResolverLike as UriRedirect<string | Uri>).to !== undefined
      ) {
        const uriRedirect = staticResolverLike as UriRedirect<string | Uri>;
        const from = toUri(uriRedirect.from);

        uriMap.set(from.uri, {
          type: "uri",
          uri: toUri(uriRedirect.to),
        });
      } else if (
        (staticResolverLike as PackageRegistration).uri !== undefined &&
        (staticResolverLike as PackageRegistration).package !== undefined
      ) {
        const uriPackage = staticResolverLike as PackageRegistration;
        const uri = toUri(uriPackage.uri);

        uriMap.set(uri.uri, {
          type: "package",
          uri,
          package: uriPackage.package,
        });
      } else if (
        (staticResolverLike as WrapperRegistration).uri !== undefined &&
        (staticResolverLike as WrapperRegistration).wrapper !== undefined
      ) {
        const uriWrapper = staticResolverLike as WrapperRegistration;
        const uri = toUri(uriWrapper.uri);

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

  // TODO: add history
  async tryResolveUri(uri: Uri): Promise<Result<UriPackageOrWrapper, TError>> {
    const result = this.uriMap.get(uri.uri);

    if (result) {
      return UriResolutionResult.ok(result);
    } else {
      return UriResolutionResult.ok(uri);
    }
  }
}
