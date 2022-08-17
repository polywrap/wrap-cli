import {
  Uri,
  Client,
  WrapperCache,
  IUriResolutionStep,
  IUriResolutionResponse,
} from "../../..";

export interface ICacheResolver<TError = undefined> {
  name: string;
  tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: IUriResolutionStep<unknown>[]
  ): Promise<IUriResolutionResponse<TError>>;

  onResolutionEnd(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    response: IUriResolutionResponse<TError>
  ): Promise<IUriResolutionResponse<TError>>;
}
