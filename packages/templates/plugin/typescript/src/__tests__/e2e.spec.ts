import { Web3ApiClient } from "@web3api/client-js";
import { samplePlugin } from "../";

describe("e2e", () => {

  let client: Web3ApiClient;
  const uri = "ens/sampleplugin.eth";

  beforeAll(() => {
    // Add the samplePlugin to the Web3ApiClient
    client = new Web3ApiClient({
      plugins: [
        {
          uri: uri,
          plugin: samplePlugin({ defaultValue: "foo bar" })
        }
      ]
    });
  });

  it("sampleQuery", async () => {
    const result = await client.query({
      uri,
      query: `query {
        sampleQuery(
          data: "fuz baz "
        )
      }`
    });

    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(result.data?.sampleQuery).toBe("fuz baz foo bar");
  });

  it("sampleMutation", async () => {
    const result = await client.query<{
      sampleMutation: boolean
    }>({
      uri,
      query: `mutation {
        sampleMutation(
          data: $data
        )
      }`,
      variables: {
        data: new Uint8Array([1, 2, 3, 4, 5])
      }
    });

    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(result.data?.sampleMutation).toBe(true);
  });
});
