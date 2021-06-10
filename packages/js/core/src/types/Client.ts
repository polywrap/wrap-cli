import {
  Uri,
  UriRedirect,
  UriInterfaceImplementations,
  QueryHandler,
  InvokeHandler,
} from "./";

export interface Client extends QueryHandler, InvokeHandler {
  redirects: () => readonly UriRedirect<Uri>[];
  implementations: () => readonly UriInterfaceImplementations<Uri>[];
}
