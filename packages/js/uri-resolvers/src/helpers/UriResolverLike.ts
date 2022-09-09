import {
  IUriResolver,
  UriRedirect,
  Uri,
  PluginRegistration,
  IWrapPackage,
} from "@polywrap/core-js";

export type UriResolverLike =
  | IUriResolver<unknown>
  | UriRedirect<string | Uri>
  | UriResolverLike[]
  | IWrapPackage
  | PluginRegistration<string | Uri>;

