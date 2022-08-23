import {
  Uri,
  Client,
  IUriResolutionStep,
  IUriResolutionResponse,
} from "@polywrap/core-js";

export interface ICacheResolver<TError = undefined> {
  name: string;
  tryResolveUri(
    uri: Uri,
    client: Client,
    resolutionPath: IUriResolutionStep<unknown>[]
  ): Promise<IUriResolutionResponse<TError>>;

  onResolutionEnd(
    uri: Uri,
    client: Client,
    response: IUriResolutionResponse<TError>
  ): Promise<IUriResolutionResponse<TError>>;
}
