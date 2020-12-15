import {
  UriRedirect,
  QueryHandler
} from "./";

// TODO: extend 'InvokeHandler'. Query -> Invoke, Request -> Invoke
export interface Client extends QueryHandler {
  redirects: () => readonly UriRedirect[];
}
