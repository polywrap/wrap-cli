import { WrapperCache, Client, Uri } from "../../../types";
import { IUriResolver, IUriResolutionStep, UriResolutionResult } from ".";

export interface UriResolver<TResolutionError> extends IUriResolver {
  tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: IUriResolutionStep[]
  ): Promise<UriResolutionResult<TResolutionError>>;
}
