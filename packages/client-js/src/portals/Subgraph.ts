import {Query, QueryResult} from '../lib/types';

import {execute, makePromise} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import fetch from 'cross-fetch';

export interface ISubgraphConfig {
  provider: string;
}

export class Subgraph {
  constructor(private _config: ISubgraphConfig) {}

  public query(subgraphId: string, query: Query): Promise<QueryResult> {
    const link = createHttpLink({
      uri: `${this._config.provider}/subgraphs/id/${subgraphId}`,
      fetch,
    });
    // TODO: get the errors, query typos are getting swallowed
    return makePromise(execute(link, query));
  }
}
