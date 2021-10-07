import { plugin, GraphNodePlugin } from "..";
import { Web3ApiClient } from "@web3api/client-js";

const uri = "ens/graph-node.web3api.eth";
const provider = "https://api.thegraph.com";

describe("Graph Node Plugin", () => {
  const client = new Web3ApiClient({
    plugins: [{
      uri,
      plugin: plugin({
        provider
      })
    }]
  });

  const graphNode = new GraphNodePlugin({
    provider
  });

  it("Query works", async () => {
    const { data, errors } = await client.query({
      uri,
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

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data?.querySubgraph).toBeDefined();

    const result = JSON.parse(data?.querySubgraph as string);

    expect(result.data).toBeDefined();
    expect(result.data.domains).toBeDefined();
    expect(result.data.transfers).toBeDefined();
  });

  it("Throws if errors in querystring", async () => {
    await expect(
      graphNode.query(
        "ensdomains",
        "ens",
        `{
          domains(first: 5) {
            ids
            names
            labelNames
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
        client
      )
    ).rejects.toThrowError();

    try {
      await graphNode.query(
        "ensdomains",
        "ens",
        `{
          domains(first: 5) {
            ids
            names
            labelNames
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
        client
      );
    } catch (e) {
      expect(e.message).toContain(
        `Message: Type \`Domain\` has no field \`ids\``
      );
      expect(e.message).toContain(
        `Message: Type \`Domain\` has no field \`names\``
      );
      expect(e.message).toContain(
        `Message: Type \`Domain\` has no field \`labelNames\``
      );
    }
  });

  it("Throws if wrong subgraph name/author", async () => {
    await expect(
      graphNode.query(
        "ens",
        "ens",
        `{
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
        client
      )
    ).rejects.toThrowError(
      new RegExp(
        "Store error: query execution failed: Subgraph `ens/ens` not found",
        "g"
      )
    );

    await expect(
      graphNode.query(
        "ensdomains",
        "foo",
        `{
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
        client
      )
    ).rejects.toThrowError(
      new RegExp(
        "Store error: query execution failed: Subgraph `ensdomains/foo` not found",
        "g"
      )
    );
  });
});
