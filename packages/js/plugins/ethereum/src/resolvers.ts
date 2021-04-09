import { EthereumPlugin } from ".";
import { Connection as SchemaConnection } from "./types";
import { Connection } from "./Connection";

import { PluginModule } from "@web3api/core-js";

export const mutation = (ethereum: EthereumPlugin): PluginModule => ({
  sendTransaction: async (input: {
    address: string;
    method: string;
    args?: string[];
    connection?: SchemaConnection;
  }) => {
    return await ethereum.sendTransaction(
      input.address,
      input.method,
      input.args || [],
      input.connection
        ? Connection.fromSchemaConnection(input.connection)
        : undefined
    );
  },

  deployContract: async (input: {
    abi: string;
    bytecode: string;
    args?: string[];
    connection?: SchemaConnection;
  }) => {
    return await ethereum.deployContract(
      input.abi,
      input.bytecode,
      input.args || [],
      input.connection
        ? Connection.fromSchemaConnection(input.connection)
        : undefined
    );
  },
});

export const query = (ethereum: EthereumPlugin): PluginModule => ({
  callView: async (input: {
    address: string;
    method: string;
    args?: string[];
    connection?: SchemaConnection;
  }) => {
    return await ethereum.callView(
      input.address,
      input.method,
      input.args || [],
      input.connection
        ? Connection.fromSchemaConnection(input.connection)
        : undefined
    );
  },
});
