import { Query } from "./schema";

import { Web3APIClientPlugin, Resolvers } from "@web3api/client-js-plugin";
import { execute, makePromise } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import fetch from "cross-fetch";
import gql from "graphql-tag";

export interface GraphNodeConfig {
  provider: string;
}

export class GraphNodePlugin extends Web3APIClientPlugin {
  constructor(private _config: GraphNodeConfig) {
    super();
  }

  public getUris(): RegExp[] {
    return [
      // Matches: graphnode.eth
      // Matches: api.graphnode.web3api.eth
      /(.*[\.])?graphnode[\.].*/,
      // Matches: w3://graphnode
      /w3:\/\/graphnode/
    ];
  }

  public getResolvers(): Resolvers {
    return {
      Query: Query(this),
      Mutation: { }
    };
  }

  public async query(subgraphId: string, query: string): Promise<string> {
    const link = createHttpLink({
      uri: `${this._config.provider}/subgraphs/id/${subgraphId}`,
      fetch
    });

    // TODO: get the errors, query typos are getting swallowed
    const result = await makePromise(
      execute(link, { query: gql(query) })
    );

    return JSON.stringify(result);
  }
}
