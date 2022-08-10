import { IUriResolutionStep, UriResolutionResult } from ".";
import { Result } from "../..";

export interface UriResolutionStep<TError = undefined>
  extends IUriResolutionStep {
  result: Result<UriResolutionResult, TError>;
}
