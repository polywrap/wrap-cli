import { UriRedirect, QueryHandler, InvokeHandler, Uri } from "./";
import { InvokeApiOptions } from "./Invoke";
import { QueryApiOptions } from "./Query";

export interface InvokeContext {
  readonly redirects: UriRedirect<Uri>[];
}

export interface Client extends QueryHandler, InvokeHandler {
  getInvokeContext: (id: string) => InvokeContext;
}

export function wrapClient(client: Client, id: string): Client {
  return {
    query: (options: QueryApiOptions<Record<string, unknown>, string>) =>
      client.query({ ...options, id: id }),
    invoke: (options: InvokeApiOptions<string>) =>
      client.invoke({ ...options, id: id }),
    getInvokeContext: () => client.getInvokeContext(id),
  };
}
