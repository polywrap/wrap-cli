import { IUriResolver, IUriResolutionStep } from ".";
import { Uri, Client, WrapperCache } from "../..";
import { IUriResolutionResult } from "./IUriResolutionResult";

export interface UriResolver<TResolutionResult extends IUriResolutionResult>
  extends IUriResolver {
  tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: IUriResolutionStep[]
  ): Promise<TResolutionResult>;
}
