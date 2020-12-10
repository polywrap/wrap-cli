import {
  SendQueryMethod,
  UriRedirect
} from "./";

export interface Client {
  query: SendQueryMethod;
  redirects: () => readonly UriRedirect[];
}
