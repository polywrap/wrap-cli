import { UriPackageOrWrapper, IUriResolutionStep } from ".";
import { Result } from "..";

export interface IUriResolutionResponse<TError = undefined> {
  result: Result<UriPackageOrWrapper, TError>;
  history?: IUriResolutionStep<unknown>[];
}
