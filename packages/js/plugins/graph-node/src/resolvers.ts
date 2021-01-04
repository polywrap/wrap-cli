import { GraphNodePlugin } from ".";

import { PluginModule } from "@web3api/core-js";

export const query = (graphnode: GraphNodePlugin): PluginModule => ({
  querySubgraph: async (input: { subgraphId: string; query: string }) => {
    return await graphnode.query(input.subgraphId, input.query);
  },
});
