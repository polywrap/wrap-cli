import { EthereumPlugin } from ".";
import { mapTxReceipt, mapTxResponse, mapLog } from "./mapping";
import {
  Connection as ConnectionOverride,
  EventNotification,
  TxOverrides,
  TxReceipt,
  TxRequest,
  TxResponse,
} from "./types";

import { PluginModule } from "@web3api/core-js";
import { ethers } from "ethers";

export const mutation = (ethereum: EthereumPlugin): PluginModule => ({
  callContractMethod: async (input: {
    address: string;
    method: string;
    args?: string[];
    connection?: ConnectionOverride;
    txOverrides?: TxOverrides;
  }): Promise<TxResponse> => {
    const response: ethers.providers.TransactionResponse = await ethereum.callContractMethod(
      input.address,
      input.method,
      input.args ?? [],
      input.connection,
      input.txOverrides
    );

    return mapTxResponse(response);
  },

  callContractMethodAndWait: async (input: {
    address: string;
    method: string;
    args?: string[];
    connection?: ConnectionOverride;
    txOverrides?: TxOverrides;
  }): Promise<TxReceipt> => {
    const response: ethers.providers.TransactionReceipt = await ethereum.callContractMethodAndWait(
      input.address,
      input.method,
      input.args ?? [],
      input.connection,
      input.txOverrides
    );

    return mapTxReceipt(response);
  },

  sendTransaction: async (input: {
    tx: TxRequest;
    connection?: ConnectionOverride;
  }): Promise<TxResponse> => {
    const res: ethers.providers.TransactionResponse = await ethereum.sendTransaction(
      input.tx,
      input.connection
    );
    return mapTxResponse(res);
  },

  sendTransactionAndWait: async (input: {
    tx: TxRequest;
    connection?: ConnectionOverride;
  }): Promise<TxReceipt> => {
    const res: ethers.providers.TransactionReceipt = await ethereum.sendTransactionAndWait(
      input.tx,
      input.connection
    );
    return mapTxReceipt(res);
  },

  deployContract: async (input: {
    abi: string;
    bytecode: string;
    args?: string[];
    connection?: ConnectionOverride;
  }): Promise<string> => {
    return await ethereum.deployContract(
      input.abi,
      input.bytecode,
      input.args ?? [],
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
  }): Promise<string> => {
    return await ethereum.callView(
      input.address,
      input.method,
      input.args ?? [],
      input.connection
    );
  },

  callContractMethodStatic: async (input: {
    address: string;
    method: string;
    args?: string[];
    connection?: ConnectionOverride;
    txOverrides?: TxOverrides;
  }): Promise<string> => {
    return await ethereum.callContractMethodStatic(
      input.address,
      input.method,
      input.args ?? [],
      input.connection,
      input.txOverrides
    );
  },

  signMessage: async (input: {
    message: string;
    connection?: ConnectionOverride;
  }): Promise<string> => {
    return await ethereum.signMessage(input.message, input.connection);
  },

  encodeParams: async (input: {
    types: string[];
    values: string[];
  }): Promise<string> => {
    return ethereum.encodeParams(input.types, input.values);
  },

  getSignerAddress: async (input: {
    connection?: ConnectionOverride;
  }): Promise<string> => {
    const connection = await ethereum.getConnection(input.connection);
    return await connection.getSigner().getAddress();
  },

  getSignerBalance: async (input: {
    blockTag?: number;
    connection?: ConnectionOverride;
  }): Promise<string> => {
    const connection = await ethereum.getConnection(input.connection);
    return (await connection.getSigner().getBalance(input.blockTag)).toString();
  },

  getSignerTransactionCount: async (input: {
    blockTag?: number;
    connection?: ConnectionOverride;
  }): Promise<string> => {
    const connection = await ethereum.getConnection(input.connection);
    return (
      await connection.getSigner().getTransactionCount(input.blockTag)
    ).toString();
  },

  getGasPrice: async (input: {
    connection?: ConnectionOverride;
  }): Promise<string> => {
    const connection = await ethereum.getConnection(input.connection);
    return (await connection.getSigner().getGasPrice()).toString();
  },

  estimateTxGas: async (input: {
    tx: TxRequest;
    connection?: ConnectionOverride;
  }): Promise<string> => {
    const connection = await ethereum.getConnection(input.connection);
    return (await connection.getSigner().estimateGas(input.tx)).toString();
  },

  estimateContractCallGas: async (input: {
    address: string;
    method: string;
    args: string[];
    connection?: ConnectionOverride;
    txOverrides?: TxOverrides;
  }): Promise<string> => {
    return await ethereum.estimateContractCallGas(
      input.address,
      input.method,
      input.args,
      input.connection,
      input.txOverrides
    );
  },

  checkAddress: async (input: { address: string }): Promise<boolean> => {
    return await ethereum.checkAddress(input.address);
  },

  toWei: async (input: { amount: string }): Promise<string> => {
    return await ethereum.toWei(input.amount);
  },

  fromWei: async (input: { amount: string }): Promise<string> => {
    return await ethereum.fromWei(input.amount);
  },

  waitForEvent: async (input: {
    address: string;
    event: string;
    args: string[];
    timeout: number;
    connection?: ConnectionOverride;
  }): Promise<EventNotification> => {
    const { data, address, log } = await ethereum.waitForEvent(
      input.address,
      input.event,
      input.args,
      input.timeout,
      input.connection
    );
    return {
      data,
      address,
      log: mapLog(log),
    };
  },

  awaitTransaction: async (input: {
    txHash: string;
    confirmations: number;
    timeout: number;
    connectionOverride?: ConnectionOverride;
  }): Promise<TxReceipt> => {
    const result: ethers.providers.TransactionReceipt = await ethereum.awaitTransaction(
      input.txHash,
      input.confirmations,
      input.timeout,
      input.connectionOverride
    );

    return mapTxReceipt(result);
  },
});
