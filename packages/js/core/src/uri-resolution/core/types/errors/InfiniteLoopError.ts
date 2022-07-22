import { UriResolutionErrorType } from "./UriResolutionErrorType";
import { UriResolutionError } from "./UriResolutionError";

export class InfiniteLoopError implements UriResolutionError {
  type: UriResolutionErrorType.InfiniteLoop;
}
