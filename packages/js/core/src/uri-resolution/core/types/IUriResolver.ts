import { WrapperCache, Client, Uri } from "../../../types";
import { IUriResolutionStep, IUriResolutionResult } from ".";

export interface IUriResolver {
  name: string;
  tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: IUriResolutionStep[]
  ): Promise<IUriResolutionResult>;
}
