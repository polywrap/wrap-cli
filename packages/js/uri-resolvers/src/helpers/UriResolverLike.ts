import {
  IUriResolver,
  UriRedirect,
  Uri,
  PluginRegistration,
  IUriPackage,
} from "@polywrap/core-js";

export type UriResolverLike =
  | IUriResolver<unknown>
  | UriRedirect<string | Uri>
  | UriResolverLike[]
  | IUriPackage
  | PluginRegistration<string | Uri>;
