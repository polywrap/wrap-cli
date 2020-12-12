import {
  UriRedirect,
  QueryHandler
} from "./";

export interface Client extends QueryHandler {
  redirects: () => readonly UriRedirect[];
}
