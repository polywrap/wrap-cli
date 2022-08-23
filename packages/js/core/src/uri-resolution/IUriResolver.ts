import { IUriResolutionStep, IUriResolutionResponse } from ".";
import { Uri, Client } from "..";

export interface IUriResolver<TError = undefined> {
  name: string;
  tryResolveUri(
    uri: Uri,
    client: Client,
    resolutionPath: IUriResolutionStep<unknown>[]
  ): Promise<IUriResolutionResponse<TError>>;
}
