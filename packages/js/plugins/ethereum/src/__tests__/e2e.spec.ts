import { ethereumPlugin } from "..";
import * as Schema from "../wrap";

import { PolywrapClient } from "@polywrap/client-js";
import { defaultIpfsProviders } from "@polywrap/client-config-builder-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import {
  initTestEnvironment,
  stopTestEnvironment,
  buildWrapper,
  ensAddresses,
  providers,
} from "@polywrap/test-env-js";
import { Wallet } from "ethers";

import { ethers } from "ethers";
import { keccak256 } from "js-sha3";
import { Connections } from "../Connections";
import { Connection } from "../Connection";

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

    client = new PolywrapClient({
      envs: [
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          env: {
            provider: providers.ipfs,
            fallbackProviders: defaultIpfsProviders,
          },
        },
      ],
      plugins: [
        {
          uri: "wrap://ens/ethereum.polywrap.eth",
          plugin: ethereumPlugin({ connections }),
        },
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          plugin: ipfsPlugin({ provider: providers.ipfs }),
        },
        {
          uri: "wrap://ens/ens-resolver.polywrap.eth",
          plugin: ensResolverPlugin({
            addresses: {
              testnet: ensAddress,
            },
          }),
        },
      ],
    });

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

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
      expect(response.data).toBe("0x0000000000000000000000000000000000000000");
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

      expect(response.error).toBeUndefined();
      expect(response.data?.error).toBeFalsy();
      expect(response.data?.result).toBe("");
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

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
      expect(response.data?.error).toBeTruthy();
      expect(response.data?.result).toContain(
        "missing revert data in call exception"
      );
    });

    it("getBalance", async () => {
      const signerAddressQuery = await client.invoke<string>({
        uri,
        method: "getSignerAddress",
      });

      const response = await client.invoke<string>({
        uri,
        method: "getBalance",
        args: {
          address: signerAddressQuery.data,
        },
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
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

      expect(response.data).toBe(
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

      expect(acceptsTupleArg.error).toBeUndefined();
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

      expect(response.error).toBeUndefined();
      expect(response.data).toBe(
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

      expect(acceptsArrayArg.error).toBeUndefined();
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
        method: "solidityKeccak256",
        args: {
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
        method: "soliditySha256",
        args: {
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
      const response = await client.invoke<string>({
        uri,
        method: "getSignerAddress",
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
      expect(response.data?.startsWith("0x")).toBe(true);
    });

    it("getSignerBalance", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "getSignerBalance",
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
    });

    it("getSignerTransactionCount", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "getSignerTransactionCount",
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
      expect(Number(response.data)).toBeTruthy();
    });

    it("getGasPrice", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "getGasPrice",
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
      expect(Number(response.data)).toBeTruthy();
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

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
      const num = ethers.BigNumber.from(response.data);
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

      expect(response.data).toBeDefined();
      expect(response.error).toBeUndefined();
      const num = ethers.BigNumber.from(response.data);
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

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
      expect(response.data).toEqual(true);
    });

    it("toWei", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "toWei",
        args: {
          eth: "20",
        },
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
      expect(response.data).toEqual("20000000000000000000");
    });

    it("toEth", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "toEth",
        args: {
          wei: "20000000000000000000",
        },
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
      expect(response.data).toEqual("20.0");
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

      expect(response.error).toBeUndefined();
      expect(response.data?.hash).toBeTruthy();
      const txHash = response.data?.hash as string;

      const awaitResponse = await client.invoke<Schema.TxReceipt>({
        uri,
        method: "awaitTransaction",
        args: {
          txHash: txHash,
          confirmations: 1,
          timeout: 60000,
        },
      });

      expect(awaitResponse.error).toBeUndefined();
      expect(awaitResponse.data).toBeDefined();
      expect(awaitResponse.data?.transactionHash).toBeDefined();
    });

    it("waitForEvent (NameTransfer)", async () => {
      const event = "event Transfer(bytes32 indexed node, address owner)";
      const label = "0x" + keccak256("testwhatever10");
      const domain = "testwhatever10.eth";
      const newOwner = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0";

      const listenerPromise = client
        .invoke<Schema.EventNotification>({
          uri,
          method: "waitForEvent",
          args: {
            address: ensAddress,
            event: event,
            args: [namehash(domain)],
            timeout: 20000,
          },
        })
        .then((result: { data: Schema.EventNotification }) => {
          expect(typeof result.data?.data === "string").toBe(true);
          expect(typeof result.data?.address === "string").toBe(true);
          expect(result.data?.log).toBeDefined();
          expect(typeof result.data?.log.transactionHash === "string").toBe(
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
        .then((result: { data: Schema.EventNotification }) => {
          expect(typeof result.data?.data === "string").toBe(true);
          expect(typeof result.data?.address === "string").toBe(true);
          expect(result.data?.log).toBeDefined();
          expect(typeof result.data?.log.transactionHash === "string").toBe(
            true
          );

          return;
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
            networkNameOrChainId: "mainnet"
          }
        }
      });

      expect(mainnetNetwork.data).toBeTruthy();
      expect(mainnetNetwork.error).toBeFalsy();
      expect(mainnetNetwork.data?.chainId).toBe("1");
      expect(mainnetNetwork.data?.name).toBe("homestead");
      expect(mainnetNetwork.data?.ensAddress).toBe(
        "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
      );
    });
    it("getNetwork - polygon", async () => {
      const polygonNetwork = await client.invoke<Schema.Network>({
        uri,
        method: "getNetwork",
        args: {
          connection: {
            node: "https://polygon-rpc.com"
          }
        }
      });

      expect(polygonNetwork.data).toBeTruthy();
      expect(polygonNetwork.error).toBeFalsy();
      expect(polygonNetwork.data?.chainId).toBe("137");
      expect(polygonNetwork.data?.name).toBe("matic");
      expect(polygonNetwork.data?.ensAddress).toBeFalsy();
    });

    it("getNetwork - mainnet with env", async () => {
      const mainnetNetwork = await client.invoke<Schema.Network>({
        uri,
        method: "getNetwork",
        config: {
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
        },
      });

      expect(mainnetNetwork.data).toBeTruthy();
      expect(mainnetNetwork.error).toBeFalsy();
      expect(mainnetNetwork.data?.chainId).toBe("1");
      expect(mainnetNetwork.data?.name).toBe("homestead");
      expect(mainnetNetwork.data?.ensAddress).toBe(
        "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
      );
    });

    it("getNetwork - polygon with env", async () => {
      const polygonNetwork = await client.invoke<Schema.Network>({
        uri,
        method: "getNetwork",
        config: {
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
        },
      });

      expect(polygonNetwork.data).toBeTruthy();
      expect(polygonNetwork.error).toBeFalsy();
      expect(polygonNetwork.data?.chainId).toBe("137");
      expect(polygonNetwork.data?.name).toBe("matic");
    });

    it("requestAccounts", async () => {
      const { error } = await client.invoke<string[]>({
        uri,
        method: "requestAccounts",
      })

      // eth_requestAccounts is not supported by Ganache
      // this RPC error indicates that the method call was attempted
      expect(error?.message.indexOf("Method eth_requestAccounts not supported")).toBeGreaterThanOrEqual(0);

      // expect(error).toBeFalsy();
      // expect(data).toBeTruthy();
      // expect(data?.length).toBeGreaterThan(0);
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
            gasLimit: "200000"
          }
        }
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
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
            gasLimit: "200000"
          }
        }
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
    });

    it("sendTransaction", async () => {
      const response = await client.invoke<Schema.TxResponse>({
        uri,
        method: "sendTransaction",
        args: {
          tx: { data: contracts.SimpleStorage.bytecode }
        }
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
      expect(response.data?.hash).toBeDefined();
    });

    it("sendTransactionAndWait", async () => {
      const response = await client.invoke<Schema.TxReceipt>({
        uri,
        method: "sendTransactionAndWait",
        args: {
          tx: { data: contracts.SimpleStorage.bytecode }
        }
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
      expect(
        response.data?.transactionHash
      ).toBeDefined();
    });

    it("deployContract", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "deployContract",
        args: {
          abi: JSON.stringify(contracts.SimpleStorage.abi),
          bytecode: contracts.SimpleStorage.bytecode
        }
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
      expect(response.data).toContain("0x");
    });

    it("signMessage", async () => {
      const response = await client.invoke<string>({
        uri,
        method: "signMessage",
        args: {
          message: "Hello World"
        }
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBe(
        "0xa4708243bf782c6769ed04d83e7192dbcf4fc131aa54fde9d889d8633ae39dab03d7babd2392982dff6bc20177f7d887e27e50848c851320ee89c6c63d18ca761c"
      );
    });

    it("sendRPC", async () => {
      const res = await client.invoke<string | undefined>({
        uri,
        method: "sendRPC",
        args: {
          method: "eth_blockNumber", params: []
        }
      });

      expect(res.error).toBeUndefined();
      expect(res.data).toBeDefined();
    });
  });

  describe("Misc", () => {
    it("Struct Argument", async () => {
      const response1 = await client.invoke<string>({
        uri,
        method: "deployContract",
        args: {
          abi: JSON.stringify(contracts.StructArg.abi),
          bytecode: contracts.StructArg.bytecode
        }
      });

      expect(response1.error).toBeUndefined();
      expect(response1.data).toBeDefined();
      expect(response1.data).toContain("0x");

      const address = response1.data as string;
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
          method: "function method(tuple(string str, uint256 unsigned256, uint256[] unsigned256Array) _arg) returns (string, uint256)",
          args: [structArg]
        }
      });

      expect(response2.error).toBeUndefined();
      expect(response2.data).toBeDefined();
      expect(
        response2.data?.transactionHash
      ).toBeDefined();
    });
  });
});
