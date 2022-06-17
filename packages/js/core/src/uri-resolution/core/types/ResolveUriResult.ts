import { Wrapper, Uri } from "../../../types";
import { UriResolutionHistory } from "../../..";
import { ResolveUriError } from "./ResolveUriError";

export type ResolveUriResult = {
  wrapper?: Wrapper;
  uri?: Uri;
  uriHistory: UriResolutionHistory;
  error?: ResolveUriError;
};
