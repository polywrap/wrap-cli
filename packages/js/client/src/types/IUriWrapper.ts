import { Uri, Wrapper } from "@polywrap/core-js";

export interface IUriWrapper<TUri extends Uri | string = string> {
  uri: TUri;
  wrapper: Wrapper;
}
