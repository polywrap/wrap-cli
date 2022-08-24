import { UriPackageOrWrapper, IUriResolutionStep } from ".";

import { Result } from "@polywrap/result";

export interface IUriResolutionResponse<TError = undefined> {
  result: Result<UriPackageOrWrapper, TError>;
  history?: IUriResolutionStep<unknown>[];
}
