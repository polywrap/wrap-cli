import {
  UriRedirect,
  Uri,
  PluginRegistration,
  IUriResolver,
  Client,
  WrapperCache,
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
    ) => Promise<{
      resolvers: IUriResolver[];
      error?: unknown;
    }>);
