import { IUriResolver, IUriResolutionStep, UriResolutionResult } from ".";
import { Uri, Client, WrapperCache } from "../..";
import { IUriResolutionError } from "./errors";

export interface UriResolver<TResolutionError extends IUriResolutionError>
  extends IUriResolver {
  tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: IUriResolutionStep[]
  ): Promise<UriResolutionResult<TResolutionError>>;
}
