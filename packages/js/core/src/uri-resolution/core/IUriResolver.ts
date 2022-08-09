import { IUriResolutionStep, IUriResolutionResult } from ".";
import { Uri, Client, WrapperCache } from "../..";

export interface IUriResolver {
  name: string;
  tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: IUriResolutionStep[]
  ): Promise<IUriResolutionResult>;
}
