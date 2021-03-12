import { Uri } from "@web3api/core-js";
import { Web3ApiClient } from "@web3api/client-js";
import ensNamehash from "eth-ens-namehash";
import { EnsNamehashPlugin } from "..";

const testToHash = "alice.eth";
const testToNormalize = "AlIcE.eth";

describe("ENS NameHash", () => {
  let client: Web3ApiClient;

  beforeAll(() => {
    client = new Web3ApiClient({
      redirects: [
        {
          from: new Uri("w3://ens/ensNamehash.web3api.eth"),
          to: {
            factory: () => new EnsNamehashPlugin(),
            manifest: EnsNamehashPlugin.manifest(),
          },
        },
      ],
    });
  });

  describe("Returned values match the plugin's", () => {
    it("hash matches", async () => {
      const expected = ensNamehash.hash(testToHash);
      const response = await client.query<{ hash: string }>({
        uri: new Uri("w3://ens/ensNamehash.web3api.eth"),
        query: `
          query {
            hash(value: "${testToHash}")
          }
        `,
      });

      expect(response.data).toBeDefined();
      expect(response.errors).toBeUndefined();
      expect(response.data?.hash).toBe(expected);
    });

    it("normalize matches", async () => {
      const expected = ensNamehash.normalize(testToNormalize);
      const response = await client.query<{ normalize: string }>({
        uri: new Uri("w3://ens/ensNamehash.web3api.eth"),
        query: `
          query {
            normalize(value: "${testToNormalize}")
          }
        `,
      });

      expect(response.data).toBeDefined();
      expect(response.errors).toBeUndefined();
      expect(response.data?.normalize).toBe(expected);
    });
  });
});
