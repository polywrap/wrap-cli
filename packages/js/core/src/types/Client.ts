import {
  Uri,
  UriRedirect,
  InterfaceImplementations,
  QueryHandler,
  InvokeHandler,
} from "./";

export interface Client extends QueryHandler, InvokeHandler {
  redirects: () => readonly UriRedirect<Uri>[];
  interfaces: () => readonly InterfaceImplementations<Uri>[];
}
