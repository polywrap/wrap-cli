import { defaultAbiCoder } from 'ethers/lib/utils';
import { Web3ApiClient } from "@web3api/client-js";
import { keccak256 } from "js-sha3";
import { ethereumPlugin } from "..";
import axios from "axios"
import { ethers } from "ethers";

const { hash: namehash } = require("eth-ens-namehash")

describe("Ethereum Plugin", () => {
  let client: Web3ApiClient;
  let ensAddress: string;
  // let resolverAddress: string;
  let registrarAddress: string;
  // let reverseAddress: string;
  const signer = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"

  beforeAll(async () => {
    client = new Web3ApiClient({
      redirects: [
        {
          from: "w3://ens/ethereum.web3api.eth",
          to: ethereumPlugin({
            provider: "http://localhost:8545",
          }),
        },
      ],
    });

    const { data } = await axios.get("http://localhost:4040/deploy-ens");

    ensAddress = data.ensAddress
    // resolverAddress = data.resolverAddress
    registrarAddress = data.registrarAddress
    // reverseAddress = data.reverseAddress
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

    it("Estimate Tx Gas", async () => {
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
  })

  describe("Mutation", () => {
    it("CallContractMethod", async () => {
      const label = "0x" + keccak256("testwhatever")
      const response = await client.query<{ callContractMethod: ethers.providers.TransactionReceipt }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          mutation {
            callContractMethod(address: "${registrarAddress}", method: "function register(bytes32 label, address owner)", args: ["${label}", "${signer}"])
          }
        `,
      });
  
      expect(response.data?.callContractMethod).toBeDefined()
      expect(response.errors).toBeUndefined()
    })

    it("SendTransaction", async () => {
      const label = "0x" + keccak256("testwhatever")
      const types = ["bytes32", "address"]
      const values = [label, signer]

      const data = defaultAbiCoder.encode(types, values)
      const response = await client.query<{ sendTransaction: ethers.providers.TransactionReceipt }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          mutation {
            sendTransaction(to: "${registrarAddress}", data: "${data}")
          }
        `,
      });
  
      expect(response.data?.sendTransaction).toBeDefined()
      expect(response.errors).toBeUndefined()
    })
  
    it("SendRPC", async () => {
      const response = await client.query<{ sendRPC?: string }>({
        uri: "w3://ens/ethereum.web3api.eth",
        query: `
          mutation {
            sendRPC(method: "eve_mine", params: [])
          }
        `,
      });
  
      console.log(response.data?.sendRPC)
    })
  })
});
