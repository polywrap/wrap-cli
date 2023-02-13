import { IUriRedirect, IUriPackage, IUriWrapper } from "@polywrap/core-js";

// $start: StaticResolverLike
/** A StaticResolverLike can be one of two things:
 * - An object that can be transformed into a static IUriResolver
 * - An array of StaticResolverLike
 * */
export type StaticResolverLike =
  | IUriRedirect
  | IUriPackage
  | IUriWrapper
  | StaticResolverLike[];
// $end
