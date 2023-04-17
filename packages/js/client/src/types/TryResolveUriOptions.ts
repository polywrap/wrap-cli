import { IUriResolutionContext, Uri } from "@polywrap/core-js";

export interface TryResolveUriOptions<TUri extends Uri | string = string> {
  /** The Wrapper's URI */
  uri: TUri;
  resolutionContext?: IUriResolutionContext;
}
