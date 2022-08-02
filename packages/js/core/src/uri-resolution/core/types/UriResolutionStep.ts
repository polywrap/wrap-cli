import { IUriResolutionStep, UriResolutionResult } from ".";

export interface UriResolutionStep<TError> extends IUriResolutionStep {
  result: UriResolutionResult<TError>;
}
