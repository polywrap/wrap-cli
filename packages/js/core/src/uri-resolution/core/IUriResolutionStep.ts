import { Result, Uri } from "../..";
import { UriResolutionResult } from ".";

export interface IUriResolutionStep {
  resolverName: string;
  sourceUri: Uri;
  result: Result<UriResolutionResult, unknown>;
}
