import {
  Uri,
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
  | IUriRedirect<Uri | string>
  | IUriPackage<Uri | string>
  | IUriWrapper<Uri | string>
  | UriResolverLike[];
// $end
