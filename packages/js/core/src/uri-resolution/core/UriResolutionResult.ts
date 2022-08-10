import { IUriResolutionStep, Result } from "../..";
import { UriResolutionResponse } from "./UriResolutionResponse";

export interface UriResolutionResult<TError = undefined> {
  response: Result<UriResolutionResponse, TError>;
  history?: IUriResolutionStep<TError>[];
}
