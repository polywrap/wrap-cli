import { EthereumPlugin } from ".";

import { QueryResolver } from "@web3api/core-js";

export const Mutation = (ethereum: EthereumPlugin): QueryResolver => ({
  sendTransaction: async (input: { address: string, method: string, args: string[] }) => {
    return {
      data: await ethereum.sendTransaction(
        input.address,
        input.method,
        input.args
      )
    }
  },

  deployContract: async (input: { abi: string, bytecode: string }) => {
    return {
      data: await ethereum.deployContract(
        input.abi, input.bytecode
      )
    }
  }
})

export const Query = (ethereum: EthereumPlugin): QueryResolver => ({
  callView: async (input: { address: string, method: string, args: string[]}) => {
    return {
      data: await ethereum.sendTransaction(
        input.address,
        input.method,
        input.args
      )
    }
  }
});
