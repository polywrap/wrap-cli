import { ResolveUriErrorType } from ".";
import { ResolveUriError } from "./ResolveUriError";

export class InternalResolverError implements ResolveUriError {
  type: ResolveUriErrorType = ResolveUriErrorType.InternalResolver;
  resolverName: string;
  error: Error;

  constructor(resolverName: string, error: Error) {
    this.resolverName = resolverName;
    this.error = error;
  }
}
