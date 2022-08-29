import {
  IUriResolver,
  UriRedirect,
  Uri,
  PluginRegistration,
  Client,
  IUriResolutionStep,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export type UriResolverLike =
  | IUriResolver<unknown>
  | UriRedirect<string | Uri>
  | UriResolverLike[]
  | PluginRegistration<string | Uri>
  | ((
      uri: Uri,
      client: Client,
      uriResolutionPath: IUriResolutionStep<unknown>[]
    ) => Promise<Result<IUriResolver<unknown>[], unknown>>);