import { UriResolutionError } from "./UriResolutionError";
import { UriResolutionErrorType } from "./UriResolutionErrorType";

export class UriResolverError<TError> implements UriResolutionError {
  type: UriResolutionErrorType = UriResolutionErrorType.UriResolver;

  constructor(
    public readonly resolverName: string,
    public readonly error: TError
  ) {}
}
