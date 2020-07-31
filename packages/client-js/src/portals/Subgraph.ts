import { Query, QueryResult } from "../types";

import { execute, makePromise } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import fetch from "cross-fetch";

export interface ISubgraphConfig {
  provider: string;
}

export class Subgraph {
  constructor(private _config: ISubgraphConfig) { }

  public query(query: Query): Promise<QueryResult> {
    const link = createHttpLink({
      uri: this._config.provider,
      fetch
    });
    return makePromise(
      execute(link, query)
    );
  }
}
