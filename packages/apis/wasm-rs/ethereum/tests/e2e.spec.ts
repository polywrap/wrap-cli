import { Web3ApiClient } from "@web3api/client-js";
// import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ethereumSignerPlugin } from "@web3api/ethereum-signer-plugin-js";
// import { ensPlugin } from "@web3api/ens-plugin-js";
// import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import {
  initTestEnvironment,
  stopTestEnvironment,
  buildAndDeployApi
} from "@web3api/test-env-js";
import { Wallet } from "ethers";
import axios from "axios";

const { hash: namehash } = require("eth-ens-namehash");
// const contracts = {
//   StructArg: {
//     abi: require("./contracts/StructArg.ABI.json"),
//     bytecode: `0x${require("./contracts/StructArg.Bytecode.json").object}`
//   },
//   SimpleStorage: {
//     abi: require("./contracts/SimpleStorage.ABI.json"),
//     bytecode: `0x${require("./contracts/SimpleStorage.Bytecode.json").object}`
//   }
// };

jest.setTimeout(360000)

describe("Ethereum Wrapper", () => {
  let client: Web3ApiClient;
  let uri: string;
  let ensAddress: string;
  // let resolverAddress: string;
  // let registrarAddress: string;
  // const signer = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"

  beforeAll(async () => {
    const { ethereum, ipfs } = await initTestEnvironment();
    const { data } = await axios.get("http://localhost:4040/deploy-ens");

    ensAddress = data.ensAddress
    // resolverAddress = data.resolverAddress
    // registrarAddress = data.registrarAddress

    client = new Web3ApiClient({
      plugins: [
        {
          uri: "w3://ens/ethereum-signer.web3api.eth",
          plugin: ethereumSignerPlugin({
            networks: {
              testnet: {
                provider: ethereum,
                signer: new Wallet("0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"),
              }
            },
            defaultNetwork: "testnet"
          }),
        },
      ],
    });

    const api = await buildAndDeployApi(
      `${__dirname}/../`,
      ipfs,
      ensAddress
    );

    console.log(api)

    uri = `ens/testnet/${api.ensDomain}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("Query", () => {
    it("callContractView", async () => {
      const node = namehash("whatever.eth")
      const response = await client.query<{ callContractView: string }>({
        uri,
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
