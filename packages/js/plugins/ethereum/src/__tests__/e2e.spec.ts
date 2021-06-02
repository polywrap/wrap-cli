import { defaultAbiCoder } from 'ethers/lib/utils';
import { Web3ApiClient } from "@web3api/client-js";
import { keccak256 } from "js-sha3";
import { ethereumPlugin } from "..";
import axios from "axios"
import { ethers } from "ethers";

const { hash: namehash } = require("eth-ens-namehash")
jest.setTimeout(60000)

describe("Ethereum Plugin", () => {
  let client: Web3ApiClient;
  let ensAddress: string;
  let resolverAddress: string;
  let registrarAddress: string;
  // let reverseAddress: string;
  const signer = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"

  beforeAll(async () => {
    client = new Web3ApiClient({
      redirects: [
        {
          from: "w3://ens/ethereum.web3api.eth",
          to: ethereumPlugin({
            networks: {
              testnet: {
                provider: "http://localhost:8545"
              }
            },
            defaultNetwork: "testnet"
          }),
        },
      ],
    });

    const { data } = await axios.get("http://localhost:4040/deploy-ens");

    ensAddress = data.ensAddress
    resolverAddress = data.resolverAddress
    registrarAddress = data.registrarAddress
  });

  describe("Query", () => {
    it("CallView", async () => {
      const node = namehash("whatever.eth")
      const response = await client.query<{ callView: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            callView(address: "${ensAddress}", method: "function resolver(bytes32 node) external view returns (address)", args: ["${node}"])
          }
        `,
      });
  
      expect(response.data?.callView).toBeDefined()
      expect(response.data?.callView).toBe("0x0000000000000000000000000000000000000000")
      expect(response.errors).toBeUndefined()
    });

    it("Estimate Contract Call Gas", async () => {
      const label = "0x" + keccak256("testwhatever2")
      const response = await client.query<{ estimateContractCallGas: ethers.providers.TransactionReceipt }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            estimateContractCallGas(address: "${registrarAddress}", method: "function register(bytes32 label, address owner)", args: ["${label}", "${signer}"])
          }
        `,
      });
  
      expect(response.data?.estimateContractCallGas).toBeDefined()
      expect(response.errors).toBeUndefined()
    });

    it("EncodeParams", async () => {
      const response = await client.query<{ encodeParams: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            encodeParams(types: ["uint256", "uint256", "address"], values: ["8", "16", "0x0000000000000000000000000000000000000000"])
          }
        `,
      });
  
      expect(response.data?.encodeParams).toBe("0x000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000")
    })
  
    it("SignMessage", async () => {
      const response = await client.query<{ signMessage: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            signMessage(message: "Hello World")
          }
        `,
      });
  
      expect(response.errors).toBeUndefined()
      expect(response.data?.signMessage).toBe("0x3c7140261c7089ac1e2c22df6940945bfdece5bea5202f90644b3c0efe29b4fc454a3bcba410455bd0d539304057511a36b224fdaa95bff9d9bfc5cefd751ee300")
    })
  
    it("Get Signer Address", async () => {
      const response = await client.query<{ getSignerAddress: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            getSignerAddress
          }
        `,
      });
  
      expect(response.errors).toBeUndefined()
      expect(response.data?.getSignerAddress).toBeDefined()
      expect(response.data?.getSignerAddress.startsWith("0x")).toBe(true)
    })

    it("Get Signer Balance", async () => {
      const response = await client.query<{ getSignerBalance: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            getSignerBalance
          }
        `,
      });
  
      expect(response.errors).toBeUndefined()
      expect(response.data?.getSignerBalance).toBeDefined()
    })

    it("Get Signer Transaction Count", async () => {
      const response = await client.query<{ getSignerTransactionCount: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            getSignerTransactionCount
          }
        `,
      });
  
      expect(response.errors).toBeUndefined()
      expect(response.data?.getSignerTransactionCount).toBeDefined()
      expect(Number(response.data?.getSignerTransactionCount)).toBeTruthy()
    })

    it("Get Gas Price", async () => {
      const response = await client.query<{ getGasPrice: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            getGasPrice
          }
        `,
      });
  
      expect(response.errors).toBeUndefined()
      expect(response.data?.getGasPrice).toBeDefined()
      expect(Number(response.data?.getGasPrice)).toBeTruthy()
    })

    it("Estimate TX Gas", async () => {
      const label = "0x" + keccak256("testwhatever5")
      const types = ["bytes32", "address"]
      const values = [label, signer]
      const data = defaultAbiCoder.encode(types, values)

      const response = await client.query<{ estimateTxGas: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            estimateTxGas(to: "${registrarAddress}", data: "${data}")
          }
        `,
      });
  
      expect(response.data?.estimateTxGas).toBeDefined()
      expect(response.errors).toBeUndefined()
      expect(Number(response.data?.estimateTxGas)).toBeTruthy()
    })

    it("To WEI", async () => {
      const response = await client.query<{ toWei: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            toWei(amount: "20")
          }
        `,
      });
  
      expect(response.errors).toBeUndefined()
      expect(response.data?.toWei).toBeDefined()
      expect(Number(response.data?.toWei)).toEqual(20000000000000000000)
    })

    it("From WEI", async () => {
      const response = await client.query<{ fromWei: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            fromWei(amount: "20000000000000000000")
          }
        `,
      });
  
      expect(response.errors).toBeUndefined()
      expect(response.data?.fromWei).toBeDefined()
      expect(Number(response.data?.fromWei)).toEqual(20)
    })

    it("Check address", async () => {
      const response = await client.query<{ checkAddress: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            checkAddress(address: "${signer}")
          }
        `,
      });
  
      expect(response.errors).toBeUndefined()
      expect(response.data?.checkAddress).toBeDefined()
      expect(response.data?.checkAddress).toEqual(true)
    })
    

    it("Wait for event (NameTransfer)", async () => {
      const event = "event Transfer(bytes32 indexed node, address owner)"
      const label = "0x" + keccak256("testwhatever10")
      const domain = "testwhatever10.eth"
      const newOwner = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0"

      const listenerPromise = client.query<{ waitForEvent: any }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            waitForEvent(address: "${ensAddress}", event: "${event}", args: ["${namehash(domain)}"], timeout: 20000)
          }
        `,
      }).then(({ data }) => {
        expect(typeof data?.waitForEvent.data === "string").toBe(true)
        expect(typeof data?.waitForEvent.address === "string").toBe(true)
        expect(data?.waitForEvent.log).toBeDefined()
        expect(typeof data?.waitForEvent.log.transactionHash === "string").toBe(true)
      });

      
      await client.query<{ callContractMethod: ethers.providers.TransactionReceipt }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          mutation {
            callContractMethod(address: "${registrarAddress}", method: "function register(bytes32 label, address owner)", args: ["${label}", "${signer}"])
          }
        `,
      });

      await client.query<{ callContractMethod: ethers.providers.TransactionReceipt }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          mutation {
            callContractMethod(address: "${ensAddress}", method: "function setOwner(bytes32 node, address owner) external", args: ["${namehash(domain)}", "${newOwner}"])
          }
        `
      });

      await listenerPromise

    })

    it("Wait for event (NewResolver)", async () => {
      const event = "event NewResolver(bytes32 indexed node, address resolver)"
      const label = "0x" + keccak256("testwhatever12")
      const domain = "testwhatever12.eth"

      const listenerPromise = client.query<{ waitForEvent: any }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            waitForEvent(address: "${ensAddress}", event: "${event}", args: [], timeout: 20000)
          }
        `,
      }).then(({ data }) => {
        expect(typeof data?.waitForEvent.data === "string").toBe(true)
        expect(typeof data?.waitForEvent.address === "string").toBe(true)
        expect(data?.waitForEvent.log).toBeDefined()
        expect(typeof data?.waitForEvent.log.transactionHash === "string").toBe(true)

        return
      });

      await client.query<{ callContractMethod: ethers.providers.TransactionReceipt }>({
        uri: "w3://ens/ethereum.web3api.eth",
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


      await client.query<{ callContractMethod: ethers.providers.TransactionReceipt }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          mutation {
            callContractMethod(address: "${ensAddress}", method: "function setResolver(bytes32 node, address owner)", args: ["${namehash(domain)}", "${resolverAddress}"])
          }
        `
      });

      await listenerPromise

    })

    it("Estimate TX gas", async () => {
      const label = "0x" + keccak256("testwhatever23")
      const types = ["bytes32", "address"]
      const values = [label, signer]

      const data = defaultAbiCoder.encode(types, values)
      const response = await client.query<{ estimateTxGas: ethers.providers.TransactionReceipt }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            estimateTxGas(to: "${registrarAddress}", data: "${data}")
          }
        `,
      });
  
      expect(response.data?.estimateTxGas).toBeDefined()
      expect(response.errors).toBeUndefined()
    })

    it("AwaitTransaction", async () => {
      const label = "0x" + keccak256("testwhatever")
      const types = ["bytes32", "address"]
      const values = [label, signer]

      const data = defaultAbiCoder.encode(types, values)
      const response = await client.query<{ sendTransaction: ethers.providers.TransactionResponse }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          mutation {
            sendTransaction(to: "${registrarAddress}", data: "${data}")
          }
        `,
      });
  
      const txHash = response.data?.sendTransaction.hash as string

      const awaitResponse = await client.query<{ awaitTransaction: ethers.providers.TransactionReceipt }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            awaitTransaction(txHash: "${txHash}", confirmations: 1, timeout: 60000)
          }
        `,
      });

      console.log(awaitResponse.data?.awaitTransaction)

      expect(awaitResponse.data?.awaitTransaction).toBeDefined()
      expect(awaitResponse.errors).toBeUndefined()
      expect(awaitResponse.data?.awaitTransaction.transactionHash).toBeDefined()
    })

    it("CallContractMethodStatic (no error)", async () => {
      const label = "0x" + keccak256("testwhatever")
      const response = await client.query<{ callContractMethodStatic: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            callContractMethodStatic(
              address: "${registrarAddress}", 
              method: "function register(bytes32 label, address owner)", 
              args: ["${label}", "${signer}"],               
              txOverrides: {
                value: null,
                nonce: null,
                gasPrice: 50,
                gasLimit: 200000
              }
            )
          }
        `,
      });

      expect(response.data?.callContractMethodStatic).toEqual("")
      expect(response.errors).toBeUndefined()
    })

    it("CallContractMethodStatic (expecting error)", async () => {
      const label = "0x" + keccak256("testwhatever")
      const response = await client.query<{ callContractMethodStatic: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          query {
            callContractMethodStatic(
              address: "${registrarAddress}", 
              method: "function register(bytes32 label, address owner)", 
              args: ["${label}", "${signer}"],               
              txOverrides: {
                value: null,
                nonce: null,
                gasPrice: 50,
                gasLimit: 1
              }
            )
          }
        `,
      });

      expect(response.data?.callContractMethodStatic).toBeTruthy()
      expect(response.errors).toBeUndefined()
    })
  })

  describe("Mutation", () => {
    it("CallContractMethod", async () => {
      const label = "0x" + keccak256("testwhatever")
      const response = await client.query<{ callContractMethod: ethers.providers.TransactionReceipt }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          mutation {
            callContractMethod(
              address: "${registrarAddress}", 
              method: "function register(bytes32 label, address owner)", 
              args: ["${label}", "${signer}"],               
              txOverrides: {
                value: null,
                nonce: null,
                gasPrice: 50,
                gasLimit: 200000
              }
            )
          }
        `,
      });
  
      expect(response.data?.callContractMethod).toBeDefined()
      expect(response.errors).toBeUndefined()
    })

    it("CallContractMethodAndWait", async () => {
      const label = "0x" + keccak256("testwhatever")
      const response = await client.query<{ callContractMethodAndWait: ethers.providers.TransactionReceipt }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          mutation {
            callContractMethodAndWait(
              address: "${registrarAddress}", 
              method: "function register(bytes32 label, address owner)", 
              args: ["${label}", "${signer}"],
              txOverrides: {
                value: null,
                nonce: null,
                gasPrice: 50,
                gasLimit: 200000
              }
            )
          }
        `,
      });
  
      expect(response.data?.callContractMethodAndWait).toBeDefined()
      expect(response.errors).toBeUndefined()
    })

    it("SendTransaction", async () => {
      const label = "0x" + keccak256("testwhatever")
      const types = ["bytes32", "address"]
      const values = [label, signer]

      const data = defaultAbiCoder.encode(types, values)
      const response = await client.query<{ sendTransaction: ethers.providers.TransactionResponse }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          mutation {
            sendTransaction(to: "${registrarAddress}", data: "${data}")
          }
        `,
      });
  
      expect(response.data?.sendTransaction).toBeDefined()
      expect(response.errors).toBeUndefined()
      expect(response.data?.sendTransaction.hash).toBeDefined()
    })

    it("SendTransactionAndWait", async () => {
      const label = "0x" + keccak256("testwhatever")
      const types = ["bytes32", "address"]
      const values = [label, signer]

      const data = defaultAbiCoder.encode(types, values)
      const response = await client.query<{ sendTransactionAndWait: ethers.providers.TransactionReceipt }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          mutation {
            sendTransactionAndWait(to: "${registrarAddress}", data: "${data}")
          }
        `,
      });
  
      expect(response.data?.sendTransactionAndWait).toBeDefined()
      expect(response.errors).toBeUndefined()
      expect(response.data?.sendTransactionAndWait.transactionHash).toBeDefined()
    })
  
    it("SendRPC", async () => {
      await client.query<{ sendRPC?: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          mutation {
            sendRPC(method: "eve_mine", params: [])
          }
        `,
      });
    })
  })
});
