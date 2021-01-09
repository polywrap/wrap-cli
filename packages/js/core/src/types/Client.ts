import {
  UriRedirect,
  QueryHandler,
  InvokeHandler
} from "./";

export interface Client extends QueryHandler, InvokeHandler {
  redirects: () => readonly UriRedirect[];
}
