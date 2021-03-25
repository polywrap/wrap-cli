import { UriRedirect, QueryHandler, InvokeHandler, Uri } from "./";

export interface InvokeContext {
  readonly redirects: UriRedirect<Uri>[];
}

export interface Client extends QueryHandler, InvokeHandler {
  getInvokeContext: (id: string) => InvokeContext;
}
