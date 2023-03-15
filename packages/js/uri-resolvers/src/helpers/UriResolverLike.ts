import {
  UriResolver,
  UriRedirect,
  UriPackage,
  UriWrapper,
} from "@polywrap/wrap-js";

// $start: UriResolverLike
/** An UriResolverLike can be one of three things:
 * - An IUriResolver
 * - An object that can be transformed into a static IUriResolver
 * - An array of UriResolverLike
 * */
export type UriResolverLike =
  | UriResolver<unknown>
  | UriRedirect
  | UriPackage
  | UriWrapper
  | UriResolverLike[];
// $end
