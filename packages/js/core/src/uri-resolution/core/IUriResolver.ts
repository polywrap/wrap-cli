import { IUriResolutionStep, UriResolutionResult } from ".";
import { Uri, Client, WrapperCache, Result } from "../..";

export interface IUriResolver<TError = unknown> {
  name: string;
  tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: IUriResolutionStep[]
  ): Promise<Result<UriResolutionResult, TError>>;
}
