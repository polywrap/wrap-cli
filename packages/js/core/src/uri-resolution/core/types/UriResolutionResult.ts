import { UriResolutionError } from "./errors";
import { ResolveUriResult } from "./ResolveUriResult";
import { UriResolutionStep } from "./UriResolutionStep";

export interface UriResolutionResult
  extends ResolveUriResult<UriResolutionError> {
  history: UriResolutionStep[];
}
