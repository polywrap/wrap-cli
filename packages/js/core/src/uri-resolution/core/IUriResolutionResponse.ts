import { Result } from "../..";
import { IUriResolutionStep, UriPackageOrWrapper } from ".";

export interface IUriResolutionResponse<TError = undefined> {
  result: Result<UriPackageOrWrapper, TError>;
  history?: IUriResolutionStep<unknown>[];
}
