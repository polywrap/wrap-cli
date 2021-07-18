import { GraphNodePlugin } from ".";

import { PluginModule } from "@web3api/core-js";

export const query = (graphnode: GraphNodePlugin): PluginModule => ({
  querySubgraph: async (input: {
    subgraphAuthor: string;
    subgraphName: string;
    query: string;
  }) => {
    return await graphnode.query(
      input.subgraphAuthor,
      input.subgraphName,
      input.query
    );
  },
});
