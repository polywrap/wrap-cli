import {
  IUriResolver,
  IUriRedirect,
  IUriPackage,
  IUriWrapper,
} from "@polywrap/core-js";

// $start: UriResolverLike
/** An UriResolverLike can be one of three things:
 * - An IUriResolver
 * - An object that can be transformed into a static IUriResolver
 * - An array of UriResolverLike
 * */
export type UriResolverLike =
  | IUriResolver<unknown>
  | IUriRedirect
  | IUriPackage
  | IUriWrapper
  | UriResolverLike[];
// $end
