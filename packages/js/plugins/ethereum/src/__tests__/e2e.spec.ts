import { ethereumPlugin } from "..";
import * as Schema from "../query/w3";

import { Web3ApiClient, defaultIpfsProviders } from "@web3api/client-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import {
  initTestEnvironment,
  stopTestEnvironment,
  buildAndDeployApi,
} from "@web3api/test-env-js";
import { Wallet } from "ethers";

import { ethers } from "ethers";
import { keccak256 } from "js-sha3";
import axios from "axios";

const { hash: namehash } = require("eth-ens-namehash");
const contracts = {
  StructArg: {
    abi: require("./contracts/StructArg.ABI.json"),
    bytecode: `0x${require("./contracts/StructArg.Bytecode.json").object}`,
  },
  SimpleStorage: {
    abi: require("./contracts/SimpleStorage.ABI.json"),
    bytecode: `0x${require("./contracts/SimpleStorage.Bytecode.json").object}`,
  },
};

jest.setTimeout(360000);

describe("Ethereum Plugin", () => {
  let client: Web3ApiClient;
  let uri: string;
  let ensAddress: string;
  let resolverAddress: string;
  let registrarAddress: string;
  const signer = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";

  beforeAll(async () => {
    const { ethereum, ipfs } = await initTestEnvironment();
    const { data } = await axios.get("http://localhost:4040/deploy-ens");

    ensAddress = data.ensAddress;
    resolverAddress = data.resolverAddress;
    registrarAddress = data.registrarAddress;

    client = new Web3ApiClient({
      plugins: [
        {
          uri: "w3://ens/ethereum.web3api.eth",
          plugin: ethereumPlugin({
            networks: {
              testnet: {
                provider: ethereum,
                signer: new Wallet(
                  "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
                ),
              },
            },
            defaultNetwork: "testnet",
          }),
        },
        {
          uri: "w3://ens/ipfs.web3api.eth",
          plugin: ipfsPlugin({
            provider: ipfs,
            fallbackProviders: defaultIpfsProviders,
          }),
        },
        {
          uri: "w3://ens/ens.web3api.eth",
          plugin: ensPlugin({
            query: {
              addresses: {
                testnet: ensAddress,
              },
            },
          }),
        },
      ],
    });

    const api = await buildAndDeployApi({
      apiAbsPath: `${__dirname}/integration`,
      ipfsProvider: ipfs,
      ensRegistryAddress: ensAddress,
      ensRegistrarAddress: registrarAddress,
      ensResolverAddress: resolverAddress,
      ethereumProvider: ethereum,
    });

    uri = `ens/testnet/${api.ensDomain}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("Query", () => {
    it("callContractView", async () => {
      const node = namehash("whatever.eth");
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

      expect(response.errors).toBeUndefined();
      expect(response.data?.callContractView).toBeDefined();
      expect(response.data?.callContractView).toBe(
        "0x0000000000000000000000000000000000000000"
      );
    });

    it("callContractStatic (no error)", async () => {
      const label = "0x" + keccak256("testwhatever");
      const response = await client.query<{
        callContractStatic: Schema.StaticTxResult;
      }>({
        uri,
        query: `
          query {
            callContractStatic(
              address: "${registrarAddress}",
              method: "function register(bytes32 label, address owner)",
              args: ["${label}", "${signer}"],
              txOverrides: {
                value: null,
                nonce: null,
                gasPrice: "50",
                gasLimit: "200000"
              }
            )
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.callContractStatic).toBeDefined();
      expect(response.data?.callContractStatic.error).toBeFalsy();
      expect(response.data?.callContractStatic.result).toBe("");
    });

    it("callContractStatic (expecting error)", async () => {
      const label = "0x" + keccak256("testwhatever");
      const response = await client.query<{
        callContractStatic: Schema.StaticTxResult;
      }>({
        uri,
        query: `
          query {
            callContractStatic(
              address: "${registrarAddress}",
              method: "function registerr(bytes32 label, address owner)",
              args: ["${label}", "${signer}"],
              txOverrides: {
                value: null,
                nonce: null,
                gasPrice: "50",
                gasLimit: "1"
              }
            )
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.callContractStatic).toBeDefined();
      expect(response.data?.callContractStatic.error).toBeTruthy();
      expect(response.data?.callContractStatic.result).toContain(
        "missing revert data in call exception"
      );
    });

    it("getBalance", async () => {
      const signerAddressQuery = await client.invoke<string>({
        uri,
        module: "query",
        method: "getSignerAddress",
      });

      const response = await client.invoke<string>({
        uri,
        module: "query",
        method: "getBalance",
        input: {
          address: signerAddressQuery.data,
        },
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
    });

    it("encodeParams", async () => {
      const response = await client.query<{ encodeParams: string }>({
        uri,
        query: `
          query {
            encodeParams(
              types: ["uint256", "uint256", "address"],
              values: ["8", "16", "0x0000000000000000000000000000000000000000"]
            )
          }
        `,
      });

      expect(response.data?.encodeParams).toBe(
        "0x000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000"
      );

      const acceptsTupleArg = await client.query<{ encodeFunction: string }>({
        uri,
        query: `
          query {
            encodeParams(
              types: $types
              values: $values
            )
          }
        `,
        variables: {
          types: ["tuple(uint256 startTime, uint256 endTime, address token)"],
          values: [
            JSON.stringify({
              startTime: "8",
              endTime: "16",
              token: "0x0000000000000000000000000000000000000000",
            }),
          ],
        },
      });

      expect(acceptsTupleArg.errors).toBeUndefined();
    });

    it("encodeFunction", async () => {
      const response = await client.query<{ encodeFunction: string }>({
        uri,
        query: `
          query {
            encodeFunction(
              method: "function increaseCount(uint256)",
              args: ["100"]
            )
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.encodeFunction).toBe(
        "0x46d4adf20000000000000000000000000000000000000000000000000000000000000064"
      );

      const acceptsArrayArg = await client.query<{ encodeFunction: string }>({
        uri,
        query: `
          query {
            encodeFunction(
              method: $method
              args: $args
            )
          }
        `,
        variables: {
          method: "function createArr(uint256[] memory)",
          args: [JSON.stringify([1, 2])],
        },
      });

      expect(acceptsArrayArg.errors).toBeUndefined();
    });

    it("solidityPack", async () => {
      const types: string[] = [
        "address",
        "uint24",
        "address",
        "uint24",
        "address",
      ];
      const values: string[] = [
        "0x0000000000000000000000000000000000000001",
        "3000",
        "0x0000000000000000000000000000000000000002",
        "3000",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      ];
      const result = await client.invoke<string>({
        uri: uri,
        module: "query",
        method: "solidityPack",
        input: {
          types,
          values,
        },
      });

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toBe(
        "0x0000000000000000000000000000000000000001000bb80000000000000000000000000000000000000002000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
      );
    });

    it("solidityKeccak256", async () => {
      const types: string[] = [
        "address",
        "uint24",
        "address",
        "uint24",
        "address",
      ];
      const values: string[] = [
        "0x0000000000000000000000000000000000000001",
        "3000",
        "0x0000000000000000000000000000000000000002",
        "3000",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      ];
      const result = await client.invoke<string>({
        uri: uri,
        module: "query",
        method: "solidityKeccak256",
        input: {
          types,
          values,
        },
      });

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toBe(
        "0x5dd4ee83f9bab0157f0e929b6dddd106fd7de6e5089f0f05c2c0b861e3807588"
      );
    });

    it("soliditySha256", async () => {
      const types: string[] = [
        "address",
        "uint24",
        "address",
        "uint24",
        "address",
      ];
      const values: string[] = [
        "0x0000000000000000000000000000000000000001",
        "3000",
        "0x0000000000000000000000000000000000000002",
        "3000",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      ];
      const result = await client.invoke<string>({
        uri: uri,
        module: "query",
        method: "soliditySha256",
        input: {
          types,
          values,
        },
      });

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data).toBe(
        "0x8652504faf6e0d175e62c1d9c7e10d636d5ab8f153ec3257dab1726639058d27"
      );
    });

    it("getSignerAddress", async () => {
      const response = await client.query<{ getSignerAddress: string }>({
        uri,
        query: `
          query {
            getSignerAddress
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.getSignerAddress).toBeDefined();
      expect(response.data?.getSignerAddress.startsWith("0x")).toBe(true);
    });

    it("getSignerBalance", async () => {
      const response = await client.query<{ getSignerBalance: string }>({
        uri,
        query: `
          query {
            getSignerBalance
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.getSignerBalance).toBeDefined();
    });

    it("getSignerTransactionCount", async () => {
      const response = await client.query<{
        getSignerTransactionCount: string;
      }>({
        uri,
        query: `
          query {
            getSignerTransactionCount
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.getSignerTransactionCount).toBeDefined();
      expect(Number(response.data?.getSignerTransactionCount)).toBeTruthy();
    });

    it("getGasPrice", async () => {
      const response = await client.query<{ getGasPrice: string }>({
        uri,
        query: `
          query {
            getGasPrice
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.getGasPrice).toBeDefined();
      expect(Number(response.data?.getGasPrice)).toBeTruthy();
    });

    it("estimateTransactionGas", async () => {
      const data = contracts.SimpleStorage.bytecode;

      const response = await client.query<{ estimateTransactionGas: string }>({
        uri,
        query: `
          query {
            estimateTransactionGas(
              tx: {
                data: "${data}"
              }
            )
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.estimateTransactionGas).toBeDefined();
      const num = ethers.BigNumber.from(response.data?.estimateTransactionGas);
      expect(num.gt(0)).toBeTruthy();
    });

    it("estimateContractCallGas", async () => {
      const label = "0x" + keccak256("testwhatever2");
      const response = await client.query<{ estimateContractCallGas: string }>({
        uri,
        query: `
          query {
            estimateContractCallGas(
              address: "${registrarAddress}",
              method: "function register(bytes32 label, address owner)",
              args: ["${label}", "${signer}"]
            )
          }
        `,
      });

      expect(response.data?.estimateContractCallGas).toBeDefined();
      expect(response.errors).toBeUndefined();
      const num = ethers.BigNumber.from(response.data?.estimateContractCallGas);
      expect(num.gt(0)).toBeTruthy();
    });

    it("checkAddress", async () => {
      const response = await client.query<{ checkAddress: string }>({
        uri,
        query: `
          query {
            checkAddress(address: "${signer}")
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.checkAddress).toBeDefined();
      expect(response.data?.checkAddress).toEqual(true);
    });

    it("toWei", async () => {
      const response = await client.query<{ toWei: string }>({
        uri,
        query: `
          query {
            toWei(eth: "20")
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.toWei).toBeDefined();
      expect(response.data?.toWei).toEqual("20000000000000000000");
    });

    it("toEth", async () => {
      const response = await client.query<{ toEth: string }>({
        uri,
        query: `
          query {
            toEth(wei: "20000000000000000000")
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.toEth).toBeDefined();
      expect(response.data?.toEth).toEqual("20.0");
    });

    it("awaitTransaction", async () => {
      const data = contracts.SimpleStorage.bytecode;

      const response = await client.query<{
        sendTransaction: Schema.TxResponse;
      }>({
        uri,
        query: `
          mutation {
            sendTransaction(
              tx: {
                data: "${data}"
              }
            )
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.sendTransaction.hash).toBeTruthy();
      const txHash = response.data?.sendTransaction.hash as string;

      const awaitResponse = await client.query<{
        awaitTransaction: Schema.TxReceipt;
      }>({
        uri,
        query: `
          query {
            awaitTransaction(
              txHash: "${txHash}",
              confirmations: 1,
              timeout: 60000
            )
          }
        `,
      });

      expect(awaitResponse.errors).toBeUndefined();
      expect(awaitResponse.data?.awaitTransaction).toBeDefined();
      expect(
        awaitResponse.data?.awaitTransaction.transactionHash
      ).toBeDefined();
    });

    it("waitForEvent (NameTransfer)", async () => {
      const event = "event Transfer(bytes32 indexed node, address owner)";
      const label = "0x" + keccak256("testwhatever10");
      const domain = "testwhatever10.eth";
      const newOwner = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0";

      const listenerPromise = client
        .query<{ waitForEvent: Schema.EventNotification }>({
          uri,
          query: `
          query {
            waitForEvent(
              address: "${ensAddress}",
              event: "${event}",
              args: ["${namehash(domain)}"],
              timeout: 20000
            )
          }
        `,
        })
        .then(
          (result: { data: { waitForEvent: Schema.EventNotification } }) => {
            expect(typeof result.data?.waitForEvent.data === "string").toBe(
              true
            );
            expect(typeof result.data?.waitForEvent.address === "string").toBe(
              true
            );
            expect(result.data?.waitForEvent.log).toBeDefined();
            expect(
              typeof result.data?.waitForEvent.log.transactionHash === "string"
            ).toBe(true);
          }
        );

      await client.query<{ callContractMethod: Schema.TxResponse }>({
        uri,
        query: `
          mutation {
            callContractMethod(
              address: "${registrarAddress}",
              method: "function register(bytes32 label, address owner)",
              args: ["${label}", "${signer}"]
            )
          }
        `,
      });

      await client.query<{ callContractMethod: Schema.TxResponse }>({
        uri,
        query: `
          mutation {
            callContractMethod(
              address: "${ensAddress}",
              method: "function setOwner(bytes32 node, address owner) external",
              args: ["${namehash(domain)}", "${newOwner}"]
            )
          }
        `,
      });

      await listenerPromise;
    });

    it("waitForEvent (NewResolver)", async () => {
      const event = "event NewResolver(bytes32 indexed node, address resolver)";
      const label = "0x" + keccak256("testwhatever12");
      const domain = "testwhatever12.eth";

      const listenerPromise = client
        .query<{ waitForEvent: Schema.EventNotification }>({
          uri,
          query: `
          query {
            waitForEvent(
              address: "${ensAddress}",
              event: "${event}",
              args: [],
              timeout: 20000
            )
          }
        `,
        })
        .then(
          (result: { data: { waitForEvent: Schema.EventNotification } }) => {
            expect(typeof result.data?.waitForEvent.data === "string").toBe(
              true
            );
            expect(typeof result.data?.waitForEvent.address === "string").toBe(
              true
            );
            expect(result.data?.waitForEvent.log).toBeDefined();
            expect(
              typeof result.data?.waitForEvent.log.transactionHash === "string"
            ).toBe(true);

            return;
          }
        );

      await client.query({
        uri,
        query: `
          mutation {
            callContractMethod(
              address: "${registrarAddress}", 
              method: "function register(bytes32 label, address owner)", 
              args: ["${label}", "${signer}"]
            )
          }
        `,
      });

      await client.query({
        uri,
        query: `
          mutation {
            callContractMethod(
              address: "${ensAddress}",
              method: "function setResolver(bytes32 node, address owner)",
              args: ["${namehash(domain)}", "${resolverAddress}"]
            )
          }
        `,
      });

      await listenerPromise;
    });

    it("getNetwork - mainnet", async () => {
      const mainnetNetwork = await client.query<{
        getNetwork: Schema.Network;
      }>({
        uri,
        query: `
          query($networkNameOrChainId: String!) {
            getNetwork(
              connection: {
                networkNameOrChainId: $networkNameOrChainId
              }
            )
          }
        `,
        variables: {
          networkNameOrChainId: "mainnet",
        },
      });

      expect(mainnetNetwork.data).toBeTruthy();
      expect(mainnetNetwork.errors).toBeFalsy();
      expect(mainnetNetwork.data?.getNetwork.chainId).toBe("1");
      expect(mainnetNetwork.data?.getNetwork.name).toBe("homestead");
      expect(mainnetNetwork.data?.getNetwork.ensAddress).toBe(
        "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
      );
    });
    it("getNetwork - polygon", async () => {
      const polygonNetwork = await client.query<{
        getNetwork: Schema.Network;
      }>({
        uri,
        query: `
          query($node: String!) {
            getNetwork(
              connection: {
                node: $node
              }
            )
          }
        `,
        variables: {
          node: "https://polygon-rpc.com",
        },
      });

      expect(polygonNetwork.data).toBeTruthy();
      expect(polygonNetwork.errors).toBeFalsy();
      expect(polygonNetwork.data?.getNetwork.chainId).toBe("137");
      expect(polygonNetwork.data?.getNetwork.name).toBe("matic");
      expect(polygonNetwork.data?.getNetwork.ensAddress).toBeFalsy();
    });

    it("getNetwork - mainnet with env", async () => {
      const mainnetNetwork = await client.query<{
        getNetwork: Schema.Network;
      }>({
        uri,
        query: `
          query {
            getNetwork
          }
        `,
        config: {
          envs: [
            {
              uri: "w3://ens/ethereum.web3api.eth",
              common: {
                connection: {
                  networkNameOrChainId: "mainnet",
                },
              },
            },
          ],
        },
      });

      expect(mainnetNetwork.data).toBeTruthy();
      expect(mainnetNetwork.errors).toBeFalsy();
      expect(mainnetNetwork.data?.getNetwork.chainId).toBe("1");
      expect(mainnetNetwork.data?.getNetwork.name).toBe("homestead");
      expect(mainnetNetwork.data?.getNetwork.ensAddress).toBe(
        "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
      );
    });

    it("getNetwork - polygon with env", async () => {
      const polygonNetwork = await client.query<{
        getNetwork: Schema.Network;
      }>({
        uri,
        query: `
          query {
            getNetwork
          }
        `,
        config: {
          envs: [
            {
              uri: "w3://ens/ethereum.web3api.eth",
              common: {
                connection: {
                  node: "https://polygon-rpc.com",
                },
              },
            },
          ],
        },
      });

      expect(polygonNetwork.data).toBeTruthy();
      expect(polygonNetwork.errors).toBeFalsy();
      expect(polygonNetwork.data?.getNetwork.chainId).toBe("137");
      expect(polygonNetwork.data?.getNetwork.name).toBe("matic");
    });
  });

  describe("Mutation", () => {
    it("callContractMethod", async () => {
      const label = "0x" + keccak256("testwhatever");
      const response = await client.query<{
        callContractMethod: Schema.TxResponse;
      }>({
        uri,
        query: `
          mutation {
            callContractMethod(
              address: "${registrarAddress}", 
              method: "function register(bytes32 label, address owner)", 
              args: ["${label}", "${signer}"],               
              txOverrides: {
                value: null,
                nonce: null,
                gasPrice: "50",
                gasLimit: "200000"
              }
            )
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.callContractMethod).toBeDefined();
    });

    it("callContractMethodAndWait", async () => {
      const label = "0x" + keccak256("testwhatever");
      const response = await client.query<{
        callContractMethodAndWait: Schema.TxReceipt;
      }>({
        uri,
        query: `
          mutation {
            callContractMethodAndWait(
              address: "${registrarAddress}", 
              method: "function register(bytes32 label, address owner)", 
              args: ["${label}", "${signer}"],
              txOverrides: {
                value: null,
                nonce: null,
                gasPrice: "50",
                gasLimit: "200000"
              }
            )
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.callContractMethodAndWait).toBeDefined();
    });

    it("sendTransaction", async () => {
      const response = await client.query<{
        sendTransaction: Schema.TxResponse;
      }>({
        uri,
        query: `
          mutation {
            sendTransaction(tx: { data: "${contracts.SimpleStorage.bytecode}" })
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.sendTransaction).toBeDefined();
      expect(response.data?.sendTransaction.hash).toBeDefined();
    });

    it("sendTransactionAndWait", async () => {
      const response = await client.query<{
        sendTransactionAndWait: Schema.TxReceipt;
      }>({
        uri,
        query: `
          mutation {
            sendTransactionAndWait(tx: { data: "${contracts.SimpleStorage.bytecode}" })
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.sendTransactionAndWait).toBeDefined();
      expect(
        response.data?.sendTransactionAndWait.transactionHash
      ).toBeDefined();
    });

    it("deployContract", async () => {
      const response = await client.query<{ deployContract: string }>({
        uri,
        query: `mutation {
          deployContract(
            abi: $abi,
            bytecode: $bytecode
          )
        }`,
        variables: {
          abi: JSON.stringify(contracts.SimpleStorage.abi),
          bytecode: contracts.SimpleStorage.bytecode,
        },
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.deployContract).toBeDefined();
      expect(response.data?.deployContract).toContain("0x");
    });

    it("signMessage", async () => {
      const response = await client.query<{ signMessage: string }>({
        uri,
        query: `
          mutation {
            signMessage(message: "Hello World")
          }
        `,
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.signMessage).toBe(
        "0xa4708243bf782c6769ed04d83e7192dbcf4fc131aa54fde9d889d8633ae39dab03d7babd2392982dff6bc20177f7d887e27e50848c851320ee89c6c63d18ca761c"
      );
    });

    it("sendRPC", async () => {
      const res = await client.query<{ sendRPC?: string }>({
        uri,
        query: `
          mutation {
            sendRPC(method: "eth_blockNumber", params: [])
          }
        `,
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toBeDefined();
      expect(res.data?.sendRPC).toBeTruthy();
    });
  });

  describe("Misc", () => {
    it("Struct Argument", async () => {
      const response1 = await client.query<{ deployContract: string }>({
        uri,
        query: `mutation {
          deployContract(
            abi: $abi,
            bytecode: $bytecode
          )
        }`,
        variables: {
          abi: JSON.stringify(contracts.StructArg.abi),
          bytecode: contracts.StructArg.bytecode,
        },
      });

      expect(response1.errors).toBeUndefined();
      expect(response1.data?.deployContract).toBeDefined();
      expect(response1.data?.deployContract).toContain("0x");

      const address = response1.data?.deployContract as string;
      const structArg = JSON.stringify({
        str: "foo bar",
        unsigned256: 123456,
        unsigned256Array: [2345, 6789],
      });

      const response2 = await client.query<{
        callContractMethodAndWait: Schema.TxReceipt;
      }>({
        uri,
        query: `
          mutation {
            callContractMethodAndWait(
              address: "${address}",
              method: "function method(tuple(string str, uint256 unsigned256, uint256[] unsigned256Array) _arg) returns (string, uint256)",
              args: [$structArg]
            )
          }
        `,
        variables: {
          structArg,
        },
      });

      expect(response2.errors).toBeUndefined();
      expect(response2.data?.callContractMethodAndWait).toBeDefined();
      expect(
        response2.data?.callContractMethodAndWait.transactionHash
      ).toBeDefined();
    });
  });
});
