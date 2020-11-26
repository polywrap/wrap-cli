import { EthereumPlugin } from "./";

export const Mutation = (ethereum: EthereumPlugin) => ({
  sendTransaction: async (input: { address: string, method: string, args: string[] }) => {
    return ethereum.sendTransaction(
      input.address,
      input.method,
      input.args
    );
  },

  deployContract: async (input: { abi: string, bytecode: string }) => {
    return ethereum.deployContract(
      input.abi, input.bytecode
    );
  }
})

export const Query = (ethereum: EthereumPlugin) => ({
  callView: async (input: { address: string, method: string, args: string[]}) => {
    return ethereum.sendTransaction(
      input.address,
      input.method,
      input.args
    );
  }
})
