import { Uri, Wrapper } from "@polywrap/core-js";

export interface IGenericUriWrapper<TUri extends Uri | string = string> {
  uri: TUri;
  wrapper: Wrapper;
}
