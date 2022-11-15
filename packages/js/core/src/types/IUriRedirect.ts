import { Uri } from ".";

export interface IUriRedirect<TUri extends Uri | string> {
  from: TUri;
  to: TUri;
}
