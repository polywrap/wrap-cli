import { Api, Uri } from "../../../types";
import { UriResolutionHistory } from "../../..";
import { ResolveUriError } from "./ResolveUriError";

export type ResolveUriResult = {
  api?: Api;
  uri?: Uri;
  uriHistory: UriResolutionHistory;
  error?: ResolveUriError;
};
