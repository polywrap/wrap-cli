import {
  UriRedirect,
  Uri,
  PluginRegistration,
  IUriResolver,
  Client,
  WrapperCache,
  Result,
  IUriResolutionStep,
} from "../..";

export type UriResolvable =
  | IUriResolver<unknown>
  | UriRedirect<string | Uri>
  | UriResolvable[]
  | PluginRegistration<string | Uri>
  | ((
      uri: Uri,
      client: Client,
      cache: WrapperCache,
      uriResolutionPath: IUriResolutionStep<unknown>[]
    ) => Promise<Result<IUriResolver<unknown>[], unknown>>);
