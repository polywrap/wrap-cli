import { Uri, UriRedirect, QueryHandler, InvokeHandler } from "./";
import { UriInterfaceImplementations } from "./UriRedirect";

export interface Client extends QueryHandler, InvokeHandler {
  redirects: () => readonly UriRedirect<Uri>[];
  implementations: () => readonly UriInterfaceImplementations<Uri>[];
}
