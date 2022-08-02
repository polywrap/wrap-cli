import { IUriResolutionError } from "./IUriResolutionError";
import { UriResolutionErrorType } from "./UriResolutionErrorType";

export class UriResolverError<TError> implements IUriResolutionError {
  type: UriResolutionErrorType = UriResolutionErrorType.UriResolver;

  constructor(
    public readonly resolverName: string,
    public readonly error: TError
  ) {}
}
