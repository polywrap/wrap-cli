import { EthereumPlugin } from ".";

import { PluginModule } from "@web3api/core-js";

export const mutation = (ethereum: EthereumPlugin): PluginModule => ({
  sendTransaction: async (input: {
    address: string;
    method: string;
    args: string[];
  }) => {
    return await ethereum.sendTransaction(
      input.address,
      input.method,
      input.args
    );
  },

  deployContract: async (input: { abi: string; bytecode: string }) => {
    return await ethereum.deployContract(input.abi, input.bytecode);
  },
});

export const query = (ethereum: EthereumPlugin): PluginModule => ({
  callView: async (input: {
    address: string;
    method: string;
    args: string[];
  }) => {
    return await ethereum.callView(input.address, input.method, input.args);
  },
});
