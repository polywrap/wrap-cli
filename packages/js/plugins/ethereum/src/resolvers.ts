import { EthereumPlugin } from ".";
import { Connection as ConnectionOverride } from "./types";

import { PluginModule } from "@web3api/core-js";

export const mutation = (ethereum: EthereumPlugin): PluginModule => ({
  sendTransaction: async (input: {
    address: string;
    method: string;
    args?: string[];
    value?: string;
    gasLimit: string;
    connection?: ConnectionOverride;
  }) => {
    return await ethereum.sendTransaction(
      input.address,
      input.method,
      input.args || [],
      input.value,
      input.gasLimit,
      input.connection
    );
  },

  deployContract: async (input: {
    abi: string;
    bytecode: string;
    args?: string[];
    connection?: ConnectionOverride;
  }) => {
    return await ethereum.deployContract(
      input.abi,
      input.bytecode,
      input.args || [],
      input.connection
    );
  },
});

export const query = (ethereum: EthereumPlugin): PluginModule => ({
  callView: async (input: {
    address: string;
    method: string;
    args?: string[];
    connection?: ConnectionOverride;
  }) => {
    return await ethereum.callView(
      input.address,
      input.method,
      input.args || [],
      input.connection
    );
  },
});
