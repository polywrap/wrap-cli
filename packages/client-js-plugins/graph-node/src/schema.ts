import { GraphNodePlugin } from "./";

export const Query = (graphnode: GraphNodePlugin) => ({
  querySubgraph: async (input: { subgraphId: string, query: string }) => {
    return await graphnode.query(
      input.subgraphId,
      input.query
    );
  }
})
