import { Uri, Wrapper } from ".";

export interface IUriWrapper<TUri extends Uri | string> {
  uri: TUri;
  wrapper: Wrapper;
}
