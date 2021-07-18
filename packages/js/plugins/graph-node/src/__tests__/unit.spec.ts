import { GraphNodePlugin } from "..";

describe("Graph Node Plugin", () => {
  const graphNode = new GraphNodePlugin({
    provider: `https://api.thegraph.com`,
  });

  it("Query works", async () => {
    const result = await graphNode.query(
      "ensdomains",
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
      }`
    );

    const actual = JSON.parse(result);

    expect(actual.data).toBeDefined();
    expect(actual.data.domains).toBeDefined();
    expect(actual.data.transfers).toBeDefined();
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
      }`
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
      }`
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
      }`
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
      }`
      )
    ).rejects.toThrowError(
      new RegExp(
        "Store error: query execution failed: Subgraph `ensdomains/foo` not found",
        "g"
      )
    );
  });
});
