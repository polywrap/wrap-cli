import { IUriResolutionStep, UriResolutionResult } from ".";
import { IUriResolutionError } from "./errors";

export interface UriResolutionStep<TError extends IUriResolutionError>
  extends IUriResolutionStep {
  result: UriResolutionResult<TError>;
}
