import { ethereumPlugin } from "..";
import * as Schema from "../types";

import { Web3ApiClient } from "@web3api/client-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import {
  initTestEnvironment,
  stopTestEnvironment,
  buildAndDeployApi
} from "@web3api/test-env-js";

import { ethers } from "ethers";
import { keccak256 } from "js-sha3";
import axios from "axios"

const { hash: namehash } = require("eth-ens-namehash");

jest.setTimeout(60000)

describe("Ethereum Plugin", () => {
  let client: Web3ApiClient;
  let uri: string;
  let ensAddress: string;
  let resolverAddress: string;
  let registrarAddress: string;
  const signer = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"
  const simpleAbi = `[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"data","type":"uint256"}],"name":"DataSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"string","name":"ipfsHash","type":"string"}],"name":"HashSet","type":"event"},{"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getHash","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"x","type":"string"}],"name":"setHash","outputs":[],"stateMutability":"nonpayable","type":"function"}]`;
  const simpleBytecode = "0x608060405234801561001057600080fd5b506105d9806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80631ed83fd41461005157806360fe47b11461006d5780636d4ce63c14610089578063d13319c4146100a7575b600080fd5b61006b600480360381019061006691906102f6565b6100c5565b005b6100876004803603810190610082919061033b565b610116565b005b610091610159565b60405161009e9190610465565b60405180910390f35b6100af610162565b6040516100bc9190610443565b60405180910390f35b8181600191906100d69291906101f4565b507f7701f49eb9aabe8890631508a9092eabb511a34566c30f2d94ff4420da1ccb1333838360405161010a939291906103e8565b60405180910390a15050565b806000819055507f7c94a94848d5859b1a30c887dc5740bf8d1cf789779be90adda1d0d34dd25022338260405161014e92919061041a565b60405180910390a150565b60008054905090565b6060600180546101719061051a565b80601f016020809104026020016040519081016040528092919081815260200182805461019d9061051a565b80156101ea5780601f106101bf576101008083540402835291602001916101ea565b820191906000526020600020905b8154815290600101906020018083116101cd57829003601f168201915b5050505050905090565b8280546102009061051a565b90600052602060002090601f0160209004810192826102225760008555610269565b82601f1061023b57803560ff1916838001178555610269565b82800160010185558215610269579182015b8281111561026857823582559160200191906001019061024d565b5b509050610276919061027a565b5090565b5b8082111561029357600081600090555060010161027b565b5090565b60008083601f8401126102a957600080fd5b8235905067ffffffffffffffff8111156102c257600080fd5b6020830191508360018202830111156102da57600080fd5b9250929050565b6000813590506102f08161058c565b92915050565b6000806020838503121561030957600080fd5b600083013567ffffffffffffffff81111561032357600080fd5b61032f85828601610297565b92509250509250929050565b60006020828403121561034d57600080fd5b600061035b848285016102e1565b91505092915050565b61036d8161049c565b82525050565b600061037f838561048b565b935061038c8385846104d8565b6103958361057b565b840190509392505050565b60006103ab82610480565b6103b5818561048b565b93506103c58185602086016104e7565b6103ce8161057b565b840191505092915050565b6103e2816104ce565b82525050565b60006040820190506103fd6000830186610364565b8181036020830152610410818486610373565b9050949350505050565b600060408201905061042f6000830185610364565b61043c60208301846103d9565b9392505050565b6000602082019050818103600083015261045d81846103a0565b905092915050565b600060208201905061047a60008301846103d9565b92915050565b600081519050919050565b600082825260208201905092915050565b60006104a7826104ae565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b838110156105055780820151818401526020810190506104ea565b83811115610514576000848401525b50505050565b6000600282049050600182168061053257607f821691505b602082108114156105465761054561054c565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b610595816104ce565b81146105a057600080fd5b5056fea26469706673582212204f956d7623b7fe0a5a722d01575cc1d310a1a18086a604796ff457447881740864736f6c63430008030033";

  beforeAll(async () => {
    const { ethereum, ipfs } = await initTestEnvironment();
    const { data } = await axios.get("http://localhost:4040/deploy-ens");

    ensAddress = data.ensAddress
    resolverAddress = data.resolverAddress
    registrarAddress = data.registrarAddress

    client = new Web3ApiClient({
      redirects: [
        {
          from: "w3://ens/ethereum.web3api.eth",
          to: ethereumPlugin({
            networks: {
              testnet: {
                provider: ethereum
              }
            },
            defaultNetwork: "testnet"
          }),
        },
        {
          from: "w3://ens/ipfs.web3api.eth",
          to: ipfsPlugin({
            provider: ipfs,
            fallbackProviders: ["https://ipfs.io"]
          })
        }
      ],
    });

    const api = await buildAndDeployApi(
      `${__dirname}/integration`,
      ipfs,
      ensAddress
    );

    uri = `ipfs/${api.ipfsCid}`;
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

    it("callContractStatic (no error)", async () => {
      const label = "0x" + keccak256("testwhatever")
      const response = await client.query<{ callContractStatic: Schema.StaticTxResult }>({
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
      const label = "0x" + keccak256("testwhatever")
      const response = await client.query<{ callContractStatic: Schema.StaticTxResult }>({
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
      expect(response.data?.callContractStatic.result).toBe("processing response error");
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

      expect(response.data?.encodeParams).toBe("0x000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000")
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

      expect(response.errors).toBeUndefined()
      expect(response.data?.getSignerAddress).toBeDefined()
      expect(response.data?.getSignerAddress.startsWith("0x")).toBe(true)
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
  
      expect(response.errors).toBeUndefined()
      expect(response.data?.getSignerBalance).toBeDefined()
    });

    it("getSignerTransactionCount", async () => {
      const response = await client.query<{ getSignerTransactionCount: string }>({
        uri,
        query: `
          query {
            getSignerTransactionCount
          }
        `,
      });
  
      expect(response.errors).toBeUndefined()
      expect(response.data?.getSignerTransactionCount).toBeDefined()
      expect(Number(response.data?.getSignerTransactionCount)).toBeTruthy()
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
  
      expect(response.errors).toBeUndefined()
      expect(response.data?.getGasPrice).toBeDefined()
      expect(Number(response.data?.getGasPrice)).toBeTruthy()
    });

    it("estimateTransactionGas", async () => {
      const data = simpleBytecode;

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

      expect(response.errors).toBeUndefined()
      expect(response.data?.estimateTransactionGas).toBeDefined()
      const num = ethers.BigNumber.from(response.data?.estimateTransactionGas);
      expect(num.gt(0)).toBeTruthy();
    });

    it("estimateContractCallGas", async () => {
      const label = "0x" + keccak256("testwhatever2")
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
  
      expect(response.data?.estimateContractCallGas).toBeDefined()
      expect(response.errors).toBeUndefined()
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
  
      expect(response.errors).toBeUndefined()
      expect(response.data?.checkAddress).toBeDefined()
      expect(response.data?.checkAddress).toEqual(true)
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
  
      expect(response.errors).toBeUndefined()
      expect(response.data?.toWei).toBeDefined()
      expect(response.data?.toWei).toEqual("20000000000000000000")
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

      expect(response.errors).toBeUndefined()
      expect(response.data?.toEth).toBeDefined()
      expect(response.data?.toEth).toEqual("20.0")
    });

    it("awaitTransaction", async () => {
      const data = simpleBytecode;

      const response = await client.query<{ sendTransaction: Schema.TxResponse }>({
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
      const txHash = response.data?.sendTransaction.hash as string

      const awaitResponse = await client.query<{ awaitTransaction: Schema.TxReceipt }>({
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

      expect(awaitResponse.data?.awaitTransaction).toBeDefined()
      expect(awaitResponse.errors).toBeUndefined()
      expect(awaitResponse.data?.awaitTransaction.transactionHash).toBeDefined()
    });

    it("waitForEvent (NameTransfer)", async () => {
      const event = "event Transfer(bytes32 indexed node, address owner)"
      const label = "0x" + keccak256("testwhatever10")
      const domain = "testwhatever10.eth"
      const newOwner = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0"

      const listenerPromise = client.query<{ waitForEvent: Schema.EventNotification }>({
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
      }).then((result: { data: { waitForEvent: Schema.EventNotification } }) => {
        expect(typeof result.data?.waitForEvent.data === "string").toBe(true)
        expect(typeof result.data?.waitForEvent.address === "string").toBe(true)
        expect(result.data?.waitForEvent.log).toBeDefined()
        expect(typeof result.data?.waitForEvent.log.transactionHash === "string").toBe(true)
      });

      
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
        `
      });

      await listenerPromise;
    });

    it("waitForEvent (NewResolver)", async () => {
      const event = "event NewResolver(bytes32 indexed node, address resolver)"
      const label = "0x" + keccak256("testwhatever12")
      const domain = "testwhatever12.eth"

      const listenerPromise = client.query<{ waitForEvent: Schema.EventNotification }>({
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
      }).then((result: { data: { waitForEvent: Schema.EventNotification } }) => {
        expect(typeof result.data?.waitForEvent.data === "string").toBe(true)
        expect(typeof result.data?.waitForEvent.address === "string").toBe(true)
        expect(result.data?.waitForEvent.log).toBeDefined()
        expect(typeof result.data?.waitForEvent.log.transactionHash === "string").toBe(true)

        return;
      });

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
        `
      });

      await listenerPromise;
    })
  });

  describe("Mutation", () => {
    it("callContractMethod", async () => {
      const label = "0x" + keccak256("testwhatever")
      const response = await client.query<{ callContractMethod: Schema.TxResponse }>({
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

      expect(response.errors).toBeUndefined()
      expect(response.data?.callContractMethod).toBeDefined()
    });

    it("callContractMethodAndWait", async () => {
      const label = "0x" + keccak256("testwhatever")
      const response = await client.query<{ callContractMethodAndWait: Schema.TxReceipt }>({
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

      expect(response.errors).toBeUndefined()
      expect(response.data?.callContractMethodAndWait).toBeDefined()
    });

    it("sendTransaction", async () => {
      const response = await client.query<{ sendTransaction: Schema.TxResponse }>({
        uri,
        query: `
          mutation {
            sendTransaction(tx: { data: "${simpleBytecode}" })
          }
        `,
      });

      expect(response.errors).toBeUndefined()
      expect(response.data?.sendTransaction).toBeDefined()
      expect(response.data?.sendTransaction.hash).toBeDefined()
    });

    it("sendTransactionAndWait", async () => {
      const response = await client.query<{ sendTransactionAndWait: Schema.TxReceipt }>({
        uri,
        query: `
          mutation {
            sendTransactionAndWait(tx: { data: "${simpleBytecode}" })
          }
        `,
      });

      expect(response.errors).toBeUndefined()
      expect(response.data?.sendTransactionAndWait).toBeDefined()
      expect(response.data?.sendTransactionAndWait.transactionHash).toBeDefined()
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
          abi: simpleAbi,
          bytecode: simpleBytecode
        }
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
  
      expect(response.errors).toBeUndefined()
      expect(response.data?.signMessage).toBe("0x3c7140261c7089ac1e2c22df6940945bfdece5bea5202f90644b3c0efe29b4fc454a3bcba410455bd0d539304057511a36b224fdaa95bff9d9bfc5cefd751ee300")
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
});
