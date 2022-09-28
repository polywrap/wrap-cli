import * as Schema from "../wrap";

import { PolywrapClient } from "@polywrap/client-js";
import { ClientConfigBuilder, defaultIpfsProviders } from "@polywrap/client-config-builder-js";
import {
  initTestEnvironment,
  stopTestEnvironment,
  buildWrapper,
  ensAddresses,
  providers,
} from "@polywrap/test-env-js";
import {
  deployStorage,
  addPrimitiveToArrayStorage,
  addStructToStorage,
  setPrimitiveToStorage
} from './utils/storage';

import { ethers, Wallet } from "ethers";
import { keccak256 } from "js-sha3";
import { Connections } from "../Connections";
import { Connection } from "../Connection";
import { getClient } from "./helpers/getClient";

const { hash: namehash } = require("eth-ens-namehash");
const contracts = {
  StructArg: {
    abi: require("./contracts/StructArg.ABI.json"),
    bytecode: `0x${require("./contracts/StructArg.Bytecode.json").object}`,
  },
  SimpleStorage: {
    abi: require("./contracts/SimpleStorage.ABI.json"),
    bytecode: `0x${require("./contracts/SimpleStorage.Bytecode.json").object}`,
    abiSinglePrimitiveMethod: '[{"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]',
    abiArrayPrimitivesMethod: '[{"inputs":[],"name":"getSimple","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"}]',
    abiArrayStructsMethod: '[{"inputs":[],"name":"getJobs","outputs":[{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct SimpleStorage.Job[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"}]',
  },
};

jest.setTimeout(360000);

describe("Ethereum Plugin", () => {
  let client: PolywrapClient;
  let ensAddress: string;
  let resolverAddress: string;
  let registrarAddress: string;
  const signer = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";

  const wrapperPath = `${__dirname}/integration`;
  const uri = `fs/${wrapperPath}/build`;

  beforeAll(async () => {
    await initTestEnvironment();

    ensAddress = ensAddresses.ensAddress;
    resolverAddress = ensAddresses.resolverAddress;
    registrarAddress = ensAddresses.registrarAddress;

    const connections = new Connections({
      networks: {
        testnet: new Connection({
          provider: providers.ethereum,
          signer: new Wallet(
            "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
          ),
        }),
      },
      defaultNetwork: "testnet",
    });

    client = getClient(connections);
      envs: [
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          env: {
            provider: providers.ipfs,
            fallbackProviders: defaultIpfsProviders,
          },
        },
      ],

    await buildWrapper(wrapperPath);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("Query", () => {
    it("callContractView", async () => {
      const node = namehash("whatever.eth");
      const response = await client.invoke<string>({
        uri,
        method: "callContractView",
        args: {
          address: ensAddress,
          method:
            "function resolver(bytes32 node) external view returns (address)",
          args: [node],
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value).toBe("0x0000000000000000000000000000000000000000");
    });

    it("callContractView (primitive value - string ABI)", async () => {
      const storageAddress = await deployStorage(contracts.SimpleStorage.abi, contracts.SimpleStorage.bytecode)
      await setPrimitiveToStorage(contracts.SimpleStorage.abi, storageAddress, "100");

      const response = await client.invoke<string>({
        uri,
        method: "callContractView",
        args: {
          address: storageAddress,
          method: 'function get() public view returns (uint256)',
          args: [],
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      const num = ethers.BigNumber.from(response.value);
      expect(num.eq("100")).toBeTruthy();
    });

    it("callContractView (primitive value - JSON ABI)", async () => {
      const storageAddress = await deployStorage(contracts.SimpleStorage.abi, contracts.SimpleStorage.bytecode)
      await setPrimitiveToStorage(contracts.SimpleStorage.abi, storageAddress, "100");

      const response = await client.invoke<string>({
        uri,
        method: "callContractView",
        args: {
          address: storageAddress,
          method: contracts.SimpleStorage.abiSinglePrimitiveMethod,
          args: [],
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      const num = ethers.BigNumber.from(response.value);
      expect(num.eq("100")).toBeTruthy();
    });

    it("callContractView (primitives array - string ABI)", async () => {
      const storageAddress = await deployStorage(contracts.SimpleStorage.abi, contracts.SimpleStorage.bytecode)
      await addPrimitiveToArrayStorage(contracts.SimpleStorage.abi, storageAddress, "100");
      await addPrimitiveToArrayStorage(contracts.SimpleStorage.abi, storageAddress, "90");

      const response = await client.invoke<string>({
        uri,
        method: "callContractView",
        args: {
          address: storageAddress,
          method: 'function getSimple() public view returns (uint256[] memory)',
          args: [],
        },
      });

      if (!response.ok) fail(response.error);

      if (!response.value) {
        throw new Error('Empty data on view call, expecting JSON');
      }
      const result = JSON.parse(response.value);

      expect(result.length).toEqual(2);
      expect(result[0]).toEqual("100");
      expect(result[1]).toEqual("90");
    });

    it("callContractView (primitives array - JSON ABI)", async () => {
      const storageAddress = await deployStorage(contracts.SimpleStorage.abi, contracts.SimpleStorage.bytecode)
      await addPrimitiveToArrayStorage(contracts.SimpleStorage.abi, storageAddress, "100");
      await addPrimitiveToArrayStorage(contracts.SimpleStorage.abi, storageAddress, "90");

      const response = await client.invoke<string>({
        uri,
        method: "callContractView",
        args: {
          address: storageAddress,
          method: contracts.SimpleStorage.abiArrayPrimitivesMethod,
          args: [],
        },
      });

      if (!response.ok) fail(response.error);

      if (!response.value) {
        throw new Error('Empty data on view call, expecting JSON');
      }
      const result = JSON.parse(response.value);

      expect(result.length).toEqual(2);
      expect(result[0]).toEqual("100");
      expect(result[1]).toEqual("90");
    });

    it("callContractView (primitives array - non-array JSON ABI)", async () => {
      const storageAddress = await deployStorage(contracts.SimpleStorage.abi, contracts.SimpleStorage.bytecode)
      await addPrimitiveToArrayStorage(contracts.SimpleStorage.abi, storageAddress, "100");
      await addPrimitiveToArrayStorage(contracts.SimpleStorage.abi, storageAddress, "90");

      const response = await client.invoke<string>({
        uri,
        method: "callContractView",
        args: {
          address: storageAddress,
          method: '{"inputs":[],"name":"getSimple","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"}',
          args: [],
        },
      });

      if (!response.ok) fail(response.error);

      if (!response.value) {
        throw new Error('Empty data on view call, expecting JSON');
      }
      const result = JSON.parse(response.value);

      expect(result.length).toEqual(2);
      expect(result[0]).toEqual("100");
      expect(result[1]).toEqual("90");
    });

    it("callContractView (struct array empty)", async () => {
      const queueAddress = await deployStorage(contracts.SimpleStorage.abi, contracts.SimpleStorage.bytecode)

      const response = await client.invoke<string>({
        uri,
        method: "callContractView",
        args: {
          address: queueAddress,
          method: contracts.SimpleStorage.abiArrayStructsMethod,
          args: [],
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toEqual('[]');
    });

    it("callContractView (struct array single element)", async () => {
      const queueAddress = await deployStorage(contracts.SimpleStorage.abi, contracts.SimpleStorage.bytecode)
      await addStructToStorage(contracts.SimpleStorage.abi, queueAddress, [queueAddress, "100"]);

      const response = await client.invoke<string>({
        uri,
        method: "callContractView",
        args: {
          address: queueAddress,
          method: contracts.SimpleStorage.abiArrayStructsMethod,
          args: [],
        },
      });

      if (!response.ok) fail(response.error);

      if (!response.value) {
        throw new Error('Empty data on view call, expecting JSON');
      }
      const result = JSON.parse(response.value);

      expect(result.length).toEqual(1);
      expect(result[0].to).toEqual(queueAddress);
      expect(result[0].amount).toEqual("100");
    });

    it("callContractView (struct array multiple elements)", async () => {
      const queueAddress = await deployStorage(contracts.SimpleStorage.abi, contracts.SimpleStorage.bytecode)
      await addStructToStorage(contracts.SimpleStorage.abi, queueAddress, [queueAddress, "100"]);
      await addStructToStorage(contracts.SimpleStorage.abi, queueAddress, [ensAddress, "99"]);

      const response = await client.invoke<string>({
        uri,
        method: "callContractView",
        args: {
          address: queueAddress,
          method: contracts.SimpleStorage.abiArrayStructsMethod,
          args: [],
        },
      });

      if (!response.ok) fail(response.error);

      if (!response.value) {
        throw new Error('Empty data on view call, expecting JSON');
      }
      const result = JSON.parse(response.value);

      expect(result.length).toEqual(2);
      expect(result[0].to).toEqual(queueAddress);
      expect(result[0].amount).toEqual("100");
      expect(result[1].to).toEqual(ensAddress);
      expect(result[1].amount).toEqual("99");
    });

    it("callContractStatic (no error)", async () => {
      const label = "0x" + keccak256("testwhatever");
      const response = await client.invoke<Schema.StaticTxResult>({
        uri,
        method: "callContractStatic",
        args: {
          address: registrarAddress,
          method: "function register(bytes32 label, address owner)",
          args: [label, signer],
          txOverrides: {
            value: null,
            nonce: null,
            gasPrice: "50",
            gasLimit: "200000",
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value?.error).toBeFalsy();
      expect(response.value?.result).toBe("");
    });

    it("callContractStatic (expecting error)", async () => {
      const label = "0x" + keccak256("testwhatever");
      const response = await client.invoke<Schema.StaticTxResult>({
        uri,
        method: "callContractStatic",
        args: {
          address: registrarAddress,
          method: "function registerr(bytes32 label, address owner)",
          args: [label, signer],
          txOverrides: {
            value: null,
            nonce: null,
            gasPrice: "50",
            gasLimit: "1",
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value?.error).toBeTruthy();
      expect(response.value?.result).toContain(
        "missing revert data in call exception"
      );
    });

    it("getBalance", async () => {
      const signerAddressQuery = await client.invoke<string>({
        uri,
        method: "getSignerAddress",
      });
      if (!signerAddressQuery.ok) fail(signerAddressQuery.error);

      const response = await client.invoke<string>({
        uri,
        method: "getBalance",
        args: {
          address: signerAddressQuery.value,
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
    });

    it("encodeParams", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "encodeParams",
        args: {
          types: ["uint256", "uint256", "address"],
          values: ["8", "16", "0x0000000000000000000000000000000000000000"],
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBe(
        "0x000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000"
      );

      const acceptsTupleArg = await client.invoke<string>({
        uri,
        method: "encodeParams",
        args: {
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

      if (!acceptsTupleArg.ok) fail(acceptsTupleArg.error);
    });

    it("encodeFunction", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "encodeFunction",
        args: {
          method: "function increaseCount(uint256)",
          args: ["100"],
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBe(
        "0x46d4adf20000000000000000000000000000000000000000000000000000000000000064"
      );

      const acceptsArrayArg = await client.invoke<string>({
        uri,
        method: "encodeFunction",
        args: {
          method: "function createArr(uint256[] memory)",
          args: [JSON.stringify([1, 2])],
        },
      });

      if (!acceptsArrayArg.ok) fail(acceptsArrayArg.error);
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
        method: "solidityPack",
        args: {
          types,
          values,
        },
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toBeTruthy();
      expect(result.value).toBe(
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
        method: "solidityKeccak256",
        args: {
          types,
          values,
        },
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toBeTruthy();
      expect(result.value).toBe(
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
        method: "soliditySha256",
        args: {
          types,
          values,
        },
      });

      if (!result.ok) fail(result.error);
      expect(result.value).toBeTruthy();
      expect(result.value).toBe(
        "0x8652504faf6e0d175e62c1d9c7e10d636d5ab8f153ec3257dab1726639058d27"
      );
    });

    it("getSignerAddress", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "getSignerAddress",
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value?.startsWith("0x")).toBe(true);
    });

    it("getSignerBalance", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "getSignerBalance",
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
    });

    it("getSignerTransactionCount", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "getSignerTransactionCount",
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(Number(response.value)).toBeTruthy();
    });

    it("getGasPrice", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "getGasPrice",
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(Number(response.value)).toBeTruthy();
    });

    it("estimateTransactionGas", async () => {
      const data = contracts.SimpleStorage.bytecode;

      const response = await client.invoke<string>({
        uri,
        method: "estimateTransactionGas",
        args: {
          tx: {
            data: data,
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      const num = ethers.BigNumber.from(response.value);
      expect(num.gt(0)).toBeTruthy();
    });

    it("estimateContractCallGas", async () => {
      const label = "0x" + keccak256("testwhatever2");
      const response = await client.invoke<string>({
        uri,
        method: "estimateContractCallGas",
        args: {
          address: registrarAddress,
          method: "function register(bytes32 label, address owner)",
          args: [label, signer],
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      const num = ethers.BigNumber.from(response.value);
      expect(num.gt(0)).toBeTruthy();
    });

    it("checkAddress", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "checkAddress",
        args: {
          address: signer,
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value).toEqual(true);
    });

    it("toWei", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "toWei",
        args: {
          eth: "20",
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value).toEqual("20000000000000000000");
    });

    it("toEth", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "toEth",
        args: {
          wei: "20000000000000000000",
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value).toEqual("20.0");
    });

    it("awaitTransaction", async () => {
      const data = contracts.SimpleStorage.bytecode;

      const response = await client.invoke<Schema.TxResponse>({
        uri,
        method: "sendTransaction",
        args: {
          tx: {
            data: data,
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value?.hash).toBeTruthy();
      const txHash = response.value?.hash as string;

      const awaitResponse = await client.invoke<Schema.TxReceipt>({
        uri,
        method: "awaitTransaction",
        args: {
          txHash: txHash,
          confirmations: 1,
          timeout: 60000,
        },
      });

      if (!awaitResponse.ok) fail(awaitResponse.error);
      expect(awaitResponse.value).toBeDefined();
      expect(awaitResponse.value.transactionHash).toBeDefined();
    });

    it("waitForEvent (NameTransfer)", async () => {
      const event = "event Transfer(bytes32 indexed node, address owner)";
      const label = "0x" + keccak256("testwhatever10");
      const domain = "testwhatever10.eth";
      const newOwner = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0";

      const listenerPromise = client.invoke<Schema.EventNotification>({
          uri,
          method: "waitForEvent",
          args: {
            address: ensAddress,
            event: event,
            args: [namehash(domain)],
            timeout: 20000,
          },
        })
        .then((result) => {
          if (result.ok) return result.value
          else fail(result.error)
        })
        .then((result: Schema.EventNotification) => {
          expect(typeof result.data === "string").toBe(true);
          expect(typeof result.address === "string").toBe(true);
          expect(result.log).toBeDefined();
          expect(typeof result.log.transactionHash === "string").toBe(
            true
          );
        });

      await client.invoke<Schema.TxResponse>({
        uri,
        method: "callContractMethod",
        args: {
          address: registrarAddress,
          method: "function register(bytes32 label, address owner)",
          args: [label, signer],
        },
      });

      await client.invoke<Schema.TxResponse>({
        uri,
        method: "callContractMethod",
        args: {
          address: ensAddress,
          method: "function setOwner(bytes32 node, address owner) external",
          args: [namehash(domain), newOwner],
        },
      });

      await listenerPromise;
    });

    it("waitForEvent (NewResolver)", async () => {
      const event = "event NewResolver(bytes32 indexed node, address resolver)";
      const label = "0x" + keccak256("testwhatever12");
      const domain = "testwhatever12.eth";

      const listenerPromise = client
        .invoke<Schema.EventNotification>({
          uri,
          method: "waitForEvent",
          args: {
            address: ensAddress,
            event: event,
            args: [],
            timeout: 20000,
          },
        })
        .then((result) => {
          if (result.ok) return result.value
          else fail(result.error)
        })
        .then((result: Schema.EventNotification) => {
          expect(typeof result.data === "string").toBe(true);
          expect(typeof result.address === "string").toBe(true);
          expect(result.log).toBeDefined();
          expect(typeof result.log.transactionHash === "string").toBe(
            true
          );
        });

      await client.invoke({
        uri,
        method: "callContractMethod",
        args: {
          address: registrarAddress,
          method: "function register(bytes32 label, address owner)",
          args: [label, signer],
        },
      });

      await client.invoke({
        uri,
        method: "callContractMethod",
        args: {
          address: ensAddress,
          method: "function setResolver(bytes32 node, address owner)",
          args: [namehash(domain), resolverAddress],
        },
      });

      await listenerPromise;
    });

    it("getNetwork - mainnet", async () => {
      const mainnetNetwork = await client.invoke<Schema.Network>({
        uri,
        method: "getNetwork",
        args: {
          connection: {
            networkNameOrChainId: "mainnet",
          },
        },
      });

      if (!mainnetNetwork.ok) fail(mainnetNetwork.error);
      expect(mainnetNetwork.value).toBeTruthy();
      expect(mainnetNetwork.value?.chainId).toBe("1");
      expect(mainnetNetwork.value?.name).toBe("homestead");
      expect(mainnetNetwork.value?.ensAddress).toBe(
        "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
      );
    });
    it("getNetwork - polygon", async () => {
      const polygonNetwork = await client.invoke<Schema.Network>({
        uri,
        method: "getNetwork",
        args: {
          connection: {
            node: "https://polygon-rpc.com",
          },
        },
      });
 
      if (!polygonNetwork.ok) fail(polygonNetwork.error);
      expect(polygonNetwork.value).toBeTruthy();
      expect(polygonNetwork.value?.chainId).toBe("137");
      expect(polygonNetwork.value?.name).toBe("matic");
      expect(polygonNetwork.value?.ensAddress).toBeFalsy();
    });

    it("getNetwork - mainnet with env", async () => {
      const config = new ClientConfigBuilder()
        .add(client.getConfig())
        .add({
          envs: [
            {
              uri: "wrap://ens/ethereum.polywrap.eth",
              env: {
                connection: {
                  networkNameOrChainId: "mainnet",
                },
              },
            },
          ],
        })
        .build();
      const mainnetClient = new PolywrapClient(
        config
      );
      const mainnetNetwork = await mainnetClient.invoke<Schema.Network>({
        uri,
        method: "getNetwork",
      });

      if (!mainnetNetwork.ok) fail(mainnetNetwork.error);
      expect(mainnetNetwork.value).toBeTruthy();
      expect(mainnetNetwork.value?.chainId).toBe("1");
      expect(mainnetNetwork.value?.name).toBe("homestead");
      expect(mainnetNetwork.value?.ensAddress).toBe(
        "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
      );
    });

    it("getNetwork - polygon with env", async () => {
      const config = new ClientConfigBuilder()
        .add(client.getConfig())
        .add({
          envs: [
            {
              uri: "wrap://ens/ethereum.polywrap.eth",
              env: {
                connection: {
                  node: "https://polygon-rpc.com",
                },
              },
            },
          ],
        })
        .build();
      const polygonClient = new PolywrapClient(
        config
      );
      const polygonNetwork = await polygonClient.invoke<Schema.Network>({
        uri,
        method: "getNetwork",
      });

      if (!polygonNetwork.ok) fail(polygonNetwork.error);
      expect(polygonNetwork.value).toBeTruthy();
      expect(polygonNetwork.value?.chainId).toBe("137");
      expect(polygonNetwork.value?.name).toBe("matic");
    });

    it("requestAccounts", async () => {
      let result = await client.invoke<string[]>({
        uri,
        method: "requestAccounts",
      });
      result = result as { ok: false; error: Error | undefined };
      // eth_requestAccounts is not supported by Ganache
      // this RPC error indicates that the method call was attempted
      expect(
        error?.message.indexOf("Method eth_requestAccounts not supported")
      ).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Mutation", () => {
    it("callContractMethod", async () => {
      const label = "0x" + keccak256("testwhatever");
      const response = await client.invoke<Schema.TxResponse>({
        uri,
        method: "callContractMethod",
        args: {
          address: registrarAddress,
          method: "function register(bytes32 label, address owner)",
          args: [label, signer],
          txOverrides: {
            value: null,
            nonce: null,
            gasPrice: "50",
            gasLimit: "200000",
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
    });

    it("callContractMethodAndWait", async () => {
      const label = "0x" + keccak256("testwhatever");
      const response = await client.invoke<Schema.TxReceipt>({
        uri,
        method: "callContractMethodAndWait",
        args: {
          address: registrarAddress,
          method: "function register(bytes32 label, address owner)",
          args: [label, signer],
          txOverrides: {
            value: null,
            nonce: null,
            gasPrice: "50",
            gasLimit: "200000",
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
    });

    it("sendTransaction", async () => {
      const response = await client.invoke<Schema.TxResponse>({
        uri,
        method: "sendTransaction",
        args: {
          tx: { data: contracts.SimpleStorage.bytecode },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value?.hash).toBeDefined();
    });

    it("sendTransactionAndWait", async () => {
      const response = await client.invoke<Schema.TxReceipt>({
        uri,
        method: "sendTransactionAndWait",
        args: {
          tx: { data: contracts.SimpleStorage.bytecode },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(
        response.value?.transactionHash
    });

    it("deployContract", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "deployContract",
        args: {
          abi: JSON.stringify(contracts.SimpleStorage.abi),
          bytecode: contracts.SimpleStorage.bytecode,
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value).toContain("0x");
    });

    it("signMessage", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "signMessage",
        args: {
          message: "Hello World",
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBe(
        "0xa4708243bf782c6769ed04d83e7192dbcf4fc131aa54fde9d889d8633ae39dab03d7babd2392982dff6bc20177f7d887e27e50848c851320ee89c6c63d18ca761c"
      );
    });

    it("sendRPC", async () => {
      const res = await client.invoke<string | undefined>({
        uri,
        method: "sendRPC",
        args: {
          method: "eth_blockNumber",
          params: [],
        },
      });

      if (!res.ok) fail(res.error);
      expect(res.value).toBeDefined();
    });
  });

  describe("Misc", () => {
    it("Struct Argument", async () => {
      const response1 = await client.invoke<string>({
        uri,
        method: "deployContract",
        args: {
          abi: JSON.stringify(contracts.StructArg.abi),
          bytecode: contracts.StructArg.bytecode,
        },
      });

      if (!response1.ok) fail(response1.error);
      expect(response1.value).toBeDefined();
      expect(response1.value).toContain("0x");

      const address = response1.value;
      const structArg = JSON.stringify({
        str: "foo bar",
        unsigned256: 123456,
        unsigned256Array: [2345, 6789],
      });

      const response2 = await client.invoke<Schema.TxReceipt>({
        uri,
        method: "callContractMethodAndWait",
        args: {
          address: address,
          method:
            "function method(tuple(string str, uint256 unsigned256, uint256[] unsigned256Array) _arg) returns (string, uint256)",
          args: [structArg],
        },
      });

      if (!response2.ok) fail(response2.error);
      expect(response2.value).toBeDefined();
      expect(
        response2.value?.transactionHash
    });
  });
});