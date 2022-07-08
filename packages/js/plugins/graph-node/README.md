# Graph Node Plugin (@polywrap/graph-node-plugin-js)

Graph Node Plugin allows the Polywrap JS Client to send queries to the [Graph Node](https://github.com/graphprotocol/graph-node).

# Usage

``` typescript
import { graphNodePlugin } from "@polywrap/graph-node-plugin-js";
import { PolywrapClient } from "@polywrap/client-js";

export async function foo({

  const graphNodePluginURI = "ens/graph-node.polywrap.eth";
  const provider = "https://api.thegraph.com";

  // initialize client with the graph node plugin
  const client = new PolywrapClient({
    plugins: [{
      uri,
      plugin: graphNodePlugin({
        provider
      })
    }]
  });

  // and send invocations to the subgraph
  const response = await client.invoke({
    uri: graphNodePluginURI,
    method: "querySubgraph",
    args: {
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
      }`
    }
  });

  // or instantiate the plugin
  const plugin = graphNodePlugin({
    provider
  });

  // and send invocations to the subgraph
  const response' = await plugin.querySubgraph({
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
