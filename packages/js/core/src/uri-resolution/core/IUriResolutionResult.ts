import { IUriResolutionStep } from ".";
import { Uri, Wrapper } from "../..";

export interface IUriResolutionResult {
  uri: Uri;
  wrapper?: Wrapper;
  error?: unknown;
  history?: IUriResolutionStep[];
}
