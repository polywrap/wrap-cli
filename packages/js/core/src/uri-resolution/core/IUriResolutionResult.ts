import { Result } from "../..";
import { IUriResolutionStep, UriResolutionResponse } from ".";

export interface IUriResolutionResult<TError = undefined> {
  response: Result<UriResolutionResponse, TError>;
  history?: IUriResolutionStep<unknown>[];
}
