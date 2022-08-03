import {
  UriRedirect,
  Uri,
  PluginRegistration,
  IUriResolver,
  Client,
  WrapperCache,
  IUriResolutionError,
} from "../..";

export type UriResolvable =
  | IUriResolver
  | UriRedirect<string | Uri>
  | UriResolvable[]
  | PluginRegistration<string | Uri>
  | ((
      uri: Uri,
      client: Client,
      cache: WrapperCache
    ) => Promise<IUriResolver[] | IUriResolutionError>);
