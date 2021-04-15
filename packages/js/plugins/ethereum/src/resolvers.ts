import { EthereumPlugin } from ".";
import { SerializableTxRequest } from "./serialize";
import { Connection as ConnectionOverride } from "./types";

import { PluginModule } from "@web3api/core-js";

export const mutation = (ethereum: EthereumPlugin): PluginModule => ({
  callContractMethod: async (input: {
    address: string;
    method: string;
    args?: string[];
    connection?: ConnectionOverride;
  }) => {
    return await ethereum.callContractMethod(
      input.address,
      input.method,
      input.args || [],
      input.connection
    );
  },

  sendTransaction: async (input: {
    tx: SerializableTxRequest;
    connection?: ConnectionOverride;
  }) => {
    return await ethereum.sendTransaction(input.tx, input.connection);
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

  sendRPC: async (input: {
    method: string;
    params: string[];
    connection?: ConnectionOverride;
  }) => {
    return await ethereum.sendRPC(input.method, input.params, input.connection);
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

  signMessage: async (input: {
    message: string;
    connection?: ConnectionOverride;
  }) => {
    return await ethereum.signMessage(input.message, input.connection);
  },

  encodeParams: (input: { types: string[]; values: string[] }) => {
    return ethereum.encodeParams(input.types, input.values);
  },

  getSignerAddress: async (input: { connection?: ConnectionOverride }) => {
    const connection = await ethereum.getConnection(input.connection);
    return await connection.getSigner().getAddress();
  },

  getSignerBalance: async (input: {
    blockTag?: number;
    connection?: ConnectionOverride;
  }) => {
    const connection = await ethereum.getConnection(input.connection);
    return (await connection.getSigner().getBalance(input.blockTag)).toString();
  },

  getSignerTransactionCount: async (input: {
    blockTag?: number;
    connection?: ConnectionOverride;
  }) => {
    const connection = await ethereum.getConnection(input.connection);
    return (
      await connection.getSigner().getTransactionCount(input.blockTag)
    ).toString();
  },

  getGasPrice: async (input: { connection?: ConnectionOverride }) => {
    const connection = await ethereum.getConnection(input.connection);
    return (await connection.getSigner().getGasPrice()).toString();
  },

  estimateTxGas: async (input: {
    tx: SerializableTxRequest;
    connection?: ConnectionOverride;
  }) => {
    const connection = await ethereum.getConnection(input.connection);
    return (await connection.getSigner().estimateGas(input.tx)).toString();
  },

  checkAddress: async (input: { address: string }) => {
    return await ethereum.checkAddress(input.address);
  },

  toWei: async (input: { amount: string }) => {
    return await ethereum.toWei(input.amount);
  },

  fromWei: async (input: { amount: string }) => {
    return await ethereum.fromWei(input.amount);
  },

  waitForEvent: async (input: {
    address: string;
    event: string;
    args: string[];
    timeout: number;
    connection?: ConnectionOverride;
  }) => {
    return await ethereum.waitForEvent(
      input.address,
      input.event,
      input.args,
      input.timeout,
      input.connection
    );
  },

  estimateContractCallGas: async (input: {
    address: string;
    method: string;
    args: string[];
    connection?: ConnectionOverride;
  }) => {
    return await ethereum.estimateContractCallGas(
      input.address,
      input.method,
      input.args,
      input.connection
    );
  },
});
