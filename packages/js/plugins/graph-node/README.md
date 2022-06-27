# Graph Node Plugin (@polywrap/graph-node-plugin-js)

Graph Node Plugin allows the Polywrap JS Client to send queries to the [Graph Node](https://github.com/graphprotocol/graph-node).

# Usage

``` typescript
import { GraphNodePlugin, plugin } from "@polywrap/graph-node-plugin-js";
import { PolywrapClient } from "@polywrap/client-js";

export async function foo({

  const graphNodePluginURI = "ens/graph-node.polywrap.eth";
  const provider = "https://api.thegraph.com";

  // initialize client with the graph node plugin
  const client = new PolywrapClient({
    plugins: [{
      uri,
      plugin: plugin({
        provider
      })
    }]
  });

  // and send queries to the subgraph
  const response = await client.query({
    graphNodePluginURI,
    query: `query {
      querySubgraph(
        subgraphAuthor: "ensdomains",
        subgraphName: "ens",
        query: $query
      )
    }`,
    variables: {
      query: `{
        domains(first: 5) {
          id
          name
          labelName
          labelhash
        }
        transfers(first: 5) {
          id
          domain {
            id
          }
          blockNumber
          transactionID
        }
      }`
    }
  });

  // or instantiate the plugin
  const graphNodePlugin = new GraphNodePlugin({
    provider
  });

  // and send queries to the subgraph
  const response' = await graphNodePlugin.querySubgraph({
    subgraphAuthor: "ensdomains",
    subgraphName: "ens",
    query: `{
      domains(first: 5) {
        id
        name
        labelName
        labelhash
      }
      transfers(first: 5) {
        id
        domain {
          id
        }
        blockNumber
        transactionID
      }
    }`,
  }, client)
});
```
For more usage examples see `src/__tests__`.

# API

Full API in `src/schema.graphql`
