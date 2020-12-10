import { GraphNodePlugin } from ".";

import { QueryResolver } from "@web3api/core-js";

export const Query = (graphnode: GraphNodePlugin): QueryResolver => ({
  querySubgraph: async (input: { subgraphId: string, query: string }) => {
    return {
      data: await graphnode.query(
        input.subgraphId,
        input.query
      )
    }
  }
})
