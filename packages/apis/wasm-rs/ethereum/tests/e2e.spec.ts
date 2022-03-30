import { createWeb3ApiClient, Web3ApiClient } from "@web3api/client-js";
// import { ethereumSignerPlugin } from "@web3api/ethereum-signer-plugin-js";
import {
  initTestEnvironment,
  stopTestEnvironment,
  buildAndDeployApi
} from "@web3api/test-env-js";

jest.setTimeout(360000)

const simpleStorageBytecode = "0x608060405234801561001057600080fd5b5061012a806100206000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806360fe47b11460375780636d4ce63c146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b606860eb565b6040518082815260200191505060405180910390f35b806000819055507f3d38713ec8fb49acced894a52df2f06a371a15960550da9ba0f017cb7d07a8ec33604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a150565b6000805490509056fea2646970667358221220f312fe8d32f77c74cc4eb4a1f5c805d8bb124755ca4e8a1db2cce10cbb133dc564736f6c63430006060033"

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

  describe("Mutation", () => {
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
          bytecode: simpleStorageBytecode
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()
    })

    it("callContractMethod", async () => {
      const deploy = await client.invoke<any>({
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
          bytecode: simpleStorageBytecode
        }
      });

      const contractAddress = deploy.data!.contractAddress

      const response = await client.invoke<{ callContractMethod: string }>({
        uri: ensUri,
        module: "mutation",
        method: "callContractMethod",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          address: contractAddress,
          method: `function set(uint256 x)`,
          args: ["2308"]
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()

      console.log(response.data)
    })

    it("callContractMethodAndWait", async () => {
      const deploy = await client.invoke<any>({
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
          bytecode: simpleStorageBytecode
        }
      });

      const contractAddress = deploy.data!.contractAddress

      const response = await client.invoke<{ callContractMethod: string }>({
        uri: ensUri,
        module: "mutation",
        method: "callContractMethodAndWait",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          address: contractAddress,
          method: `function set(uint256 x)`,
          args: ["2308"]
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()

      console.log(response.data)
    })

    it("sendTransaction", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "mutation",
        method: "sendTransaction",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          tx: {
            data: simpleStorageBytecode
          }  
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()

      console.log(response.data)
    })

    it("sendTransactionAndWait", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "mutation",
        method: "sendTransactionAndWait",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          tx: {
            data: simpleStorageBytecode
          }  
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()

      console.log(response.data)
    })

    it("signMessage", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "mutation",
        method: "signMessage",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          message: "Hello World"
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()

      console.log(response.data)
    })

    it("sendRPC", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "mutation",
        method: "sendRpc",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          method: "eth_blockNumber",
          params: []
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()

      console.log(response.data)
    })
  })

  describe("Query", () => {
    let contractAddress: string;
    let initialValue = "777";

    beforeAll(async () => {
      const deploy = await client.invoke<any>({
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
          bytecode: simpleStorageBytecode
        }
      });

      await client.invoke<{ callContractMethod: string }>({
        uri: ensUri,
        module: "mutation",
        method: "callContractMethodAndWait",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          address: contractAddress,
          method: `function set(uint256 x)`,
          args: [initialValue]
        }
      });

      contractAddress = deploy.data!.contractAddress
    })

    it("callContractView", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "callContractView",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          address: contractAddress,
          method: "function get() public view returns (uint256)",
          args: []
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()
    });

    it("callContractStatic", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "callContractStatic",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          address: contractAddress,
          method: "function set(uint256 x)",
          args: ["555"]
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()

      console.log(response.data)
    });

    it("encodeParams", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "encodeParams",
        input: {
          types: ["uint256", "uint256", "address"],
          values: ["8", "16", "0x0000000000000000000000000000000000000000"]
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()

      //https://github.com/gakonst/ethers-rs/issues/887

      // const acceptsTupleArg = await client.invoke<any>({
      //   uri: ensUri,
      //   module: "query",
      //   method: "encodeParams",
      //   input: {
      //     types: ["tuple(uint256 startTime, uint256 endTime, address token)"],
      //     values: [JSON.stringify({ startTime: "8", endTime: "16", token: "0x0000000000000000000000000000000000000000" })]
      //   },
      // });

      // expect(acceptsTupleArg.error).toBeUndefined();
    });

    it("encodeFunction", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "encodeFunction",
        input: {
          method: "function increaseCount(uint256)",
          args: ["100"]
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()

      const acceptsArrayArg = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "encodeFunction",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          method: "function createArr(uint256[] memory)",
          args: ["1", "2"]
        },
      });

      expect(acceptsArrayArg.error).toBeUndefined();
    });

    it("getSignerAddress", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "getSignerAddress",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
        }
      });
  
      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()
    });

    it("getSignerBalance", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "getSignerBalance",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
        }
      });
  
      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()
    });

    it("getSignerTransactionCount", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "getSignerTransactionCount",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
        }
      });
  
      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()
    });

    it("getGasPrice", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "getGasPrice",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
        }
      });
  
      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()
    });

    it("estimateTransactionGas", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "estimateTransactionGas",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          tx: {
            data: simpleStorageBytecode
          }
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()
    });

    it("estimateContractCallGas", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "estimateContractCallGas",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          address: contractAddress,
          method: "function set(uint256 x)",
          args: ["444"]
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()
    });

    it("checkAddress", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "checkAddress",
        input: {
          address: contractAddress
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()
    });

    it("toWei", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "toWei",
        input: {
          eth: "20"
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()
    });

    it("toEth", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "toEth",
        input: {
          wei: "20"
        }
      });

      expect(response.error).toBeUndefined()
      expect(response.data).toBeDefined()
    });

    it("awaitTransaction", async () => {
      const response = await client.invoke<any>({
        uri: ensUri,
        module: "mutation",
        method: "sendTransaction",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          tx: {
            data: simpleStorageBytecode
          }
        }
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeTruthy();

      const txHash = response.data.hash as string

      const awaitResponse = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "awaitTransaction",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          txHash,
          confirmations: 1,
          timeout: 60000
        }
      });

      expect(awaitResponse.error).toBeUndefined()
      expect(awaitResponse.data).toBeDefined()
    });

    it("waitForEvent (DataSet)", async () => {
      const listenerPromise = client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "waitForEvent",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          address: contractAddress,
          event: "event DataSet(address from)",
          args: [],
          timeout: 20000
        }
      }).then((result) => {
        expect(result.data).toBeDefined()
        expect(result.error).toBeUndefined()

        return;
      });

      await client.invoke({
        uri: ensUri,
        module: "mutation",
        method: "waitForEvent",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          },
          address: contractAddress, 
          method: "function set(uint256 x)", 
          args: ["111"]
        },
      });

      await listenerPromise;
    });

    it("getNetwork", async () => {
      const mainnetNetwork = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "getNetwork",
        input: {
          connection: {
            networkNameOrChainId: "mainnet"
          }
        }
      });

      expect(mainnetNetwork.data).toBeDefined();
      expect(mainnetNetwork.error).toBeUndefined();
      expect(mainnetNetwork.data.chainId).toBe(1);
      expect(mainnetNetwork.data.name).toBe("homestead");
      expect(mainnetNetwork.data.ensAddress).toBe("0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e");

      const polygonNetwork = await client.invoke<any>({
        uri: ensUri,
        module: "query",
        method: "getNetwork",
        input: {
          connection: {
            node: "https://polygon-rpc.com"
          }
        }
      });

      expect(polygonNetwork.data).toBeTruthy();
      expect(polygonNetwork.error).toBeFalsy();
      expect(polygonNetwork.data.chainId).toBe(137);
      expect(polygonNetwork.data.name).toBe("matic");
      expect(polygonNetwork.data.ensAddress).toBeFalsy();
    })
  });
});
