import { GraphNodePlugin, plugin } from "..";
import { PolywrapClient } from "@polywrap/client-js";

const uri = "ens/graph-node.polywrap.eth";
const provider = "https://api.thegraph.com";

jest.setTimeout(30000);

describe("Graph Node Plugin", () => {
  const client = new PolywrapClient({
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
      graphNode.querySubgraph({
        subgraphAuthor: "ensdomains",
        subgraphName: "ens",
        query: `{
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
      }, client)
    ).rejects.toThrowError();

    try {
      await graphNode.querySubgraph({
        subgraphAuthor: "ensdomains",
        subgraphName: "ens",
        query: `{
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
      }, client);
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
      graphNode.querySubgraph({
        subgraphAuthor: "ens",
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
    ).rejects.toThrowError(
      new RegExp(
        "`ens/ens` does not exist",
        "g"
      )
    );

    await expect(
      graphNode.querySubgraph({
        subgraphAuthor: "ensdomains",
        subgraphName: "foo",
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
    ).rejects.toThrowError(
      new RegExp(
        "`ensdomains/foo` does not exist",
        "g"
      )
    );
  });
});
