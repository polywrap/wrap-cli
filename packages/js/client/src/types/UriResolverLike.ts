import { IUriPackage } from "./IUriPackage";
import { IUriRedirect } from "./IUriRedirect";
import { IUriWrapper } from "./IUriWrapper";

import { IUriResolver, Uri } from "@polywrap/core-js";

export type UriResolverLike<TUri extends Uri | string = string> =
  | IUriResolver<unknown>
  | IUriRedirect<TUri>
  | IUriPackage<TUri>
  | IUriWrapper<TUri>
  | UriResolverLike[];
