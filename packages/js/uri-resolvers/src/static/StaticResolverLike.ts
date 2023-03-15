import { UriRedirect, UriPackage, UriWrapper } from "@polywrap/wrap-js";

// $start: StaticResolverLike
/** A StaticResolverLike can be one of two things:
 * - An object that can be transformed into a static IUriResolver
 * - An array of StaticResolverLike
 * */
export type StaticResolverLike =
  | UriRedirect
  | UriPackage
  | UriWrapper
  | StaticResolverLike[];
// $end
