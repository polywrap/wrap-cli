import {
  IUriResolver,
  UriRedirect,
  Uri,
  PluginRegistration,
  Client,
  IUriResolutionStep,
  Result,
} from "@polywrap/core-js";

export type UriResolvable =
  | IUriResolver<unknown>
  | UriRedirect<string | Uri>
  | UriResolvable[]
  | PluginRegistration<string | Uri>
  | ((
      uri: Uri,
      client: Client,
      uriResolutionPath: IUriResolutionStep<unknown>[]
    ) => Promise<Result<IUriResolver<unknown>[], unknown>>);
