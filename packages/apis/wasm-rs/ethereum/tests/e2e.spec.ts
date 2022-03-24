import { createWeb3ApiClient, Web3ApiClient } from "@web3api/client-js";
// import { ethereumSignerPlugin } from "@web3api/ethereum-signer-plugin-js";
import {
  initTestEnvironment,
  stopTestEnvironment,
  buildAndDeployApi
} from "@web3api/test-env-js";

const { hash: namehash } = require("eth-ens-namehash");

jest.setTimeout(360000)

describe("Ethereum Wrapper", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensUri: string;
  let client: Web3ApiClient;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;

    const api = await buildAndDeployApi(
      `${__dirname}/../`,
      ipfs,
      ensAddress
    );
    console.log(ethProvider)

    ensUri = `ens/testnet/${api.ensDomain}`;
    // ipfsUri = `ipfs/${api.ipfsCid}`;

    client = await createWeb3ApiClient({
      ethereum: {
        networks: {
          testnet: {
            provider: ethProvider
          },
        },
      },
      ipfs: { provider: ipfsProvider },
      ens: {
        addresses: {
          testnet: ensAddress,
        },
      },
    });
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe.only("Mutation", () => {
    it("deployContract", async () => {
      const response = await client.invoke<{ deployContract: string }>({
        uri: ensUri,
        module: "mutation",
        method: "deployContract",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          abi: `[
            event DataSet(address from)
            function get(uint256) view returns (uint256)
            function set(uint256 x)
          ]`,
          bytecode: "0x608060405234801561001057600080fd5b5061012a806100206000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806360fe47b11460375780636d4ce63c146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b606860eb565b6040518082815260200191505060405180910390f35b806000819055507f3d38713ec8fb49acced894a52df2f06a371a15960550da9ba0f017cb7d07a8ec33604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a150565b6000805490509056fea2646970667358221220f312fe8d32f77c74cc4eb4a1f5c805d8bb124755ca4e8a1db2cce10cbb133dc564736f6c63430006060033"
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()

      console.log(response.data)
    })
  })

  describe("Query", () => {
    it("callContractView", async () => {
      const node = namehash("whatever.eth")
      const response = await client.query<{ callContractView: string }>({
        uri: ensUri,
        query: `
          query {
            callContractView(
              address: "${ensAddress}",
              method: "function resolver(bytes32 node) external view returns (address)",
              args: ["${node}"]
            )
          }
        `,
      });

      expect(response.errors).toBeUndefined()
      expect(response.data?.callContractView).toBeDefined()
      expect(response.data?.callContractView).toBe("0x0000000000000000000000000000000000000000")
    });
  });
});
