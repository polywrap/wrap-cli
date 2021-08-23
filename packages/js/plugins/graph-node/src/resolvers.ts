import { GraphNodePlugin } from ".";
import { Query } from "./w3";

import { Client } from "@web3api/core-js";

export const query = (
  graphnode: GraphNodePlugin,
  client: Client
): Query.Module => ({
  querySubgraph: async (input: Query.Input_querySubgraph): Promise<string> => {
    return await graphnode.query(
      input.subgraphAuthor,
      input.subgraphName,
      input.query,
      client
    );
  },
});
