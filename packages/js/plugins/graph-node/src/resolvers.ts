import { GraphNodePlugin } from ".";

import { Client, PluginModule } from "@web3api/core-js";

export const query = (
  graphnode: GraphNodePlugin,
  client: Client
): PluginModule => ({
  querySubgraph: async (input: {
    subgraphAuthor: string;
    subgraphName: string;
    query: string;
  }): Promise<string> => {
    return await graphnode.query(
      input.subgraphAuthor,
      input.subgraphName,
      input.query,
      client
    );
  },
});
