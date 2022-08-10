import {
  UriRedirect,
  Uri,
  PluginRegistration,
  IUriResolver,
  Client,
  WrapperCache,
  Result,
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
    ) => Promise<Result<IUriResolver[], unknown>>);
