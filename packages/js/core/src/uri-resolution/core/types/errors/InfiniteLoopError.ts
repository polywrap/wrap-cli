import { UriResolutionErrorType } from "./UriResolutionErrorType";
import { IUriResolutionError } from "./IUriResolutionError";

export class InfiniteLoopError implements IUriResolutionError {
  type: UriResolutionErrorType.InfiniteLoop;
}
