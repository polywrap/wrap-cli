import { IUriResolutionStep, IUriResolutionResponse } from ".";
import { Uri, Client, WrapperCache } from "..";

export interface IUriResolver<TError = undefined> {
  name: string;
  tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: IUriResolutionStep<unknown>[]
  ): Promise<IUriResolutionResponse<TError>>;
}
