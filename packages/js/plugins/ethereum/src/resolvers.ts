import { EthereumPlugin as Plugin } from ".";
import * as Schema from "./types";

export const mutation = (plugin: Plugin): Schema.Mutation => ({
  callContractMethod: async (
    input: Schema.Input_callContractMethod
  ): Promise<Schema.TxResponse> => {
    return plugin.callContractMethod(
      input
    );
  },

  callContractMethodAndWait: async (
    input: Schema.Input_callContractMethodAndWait
  ): Promise<Schema.TxReceipt> => {
    return plugin.callContractMethodAndWait(
      input
    );
  },

  sendTransaction: async (
    input: Schema.Input_sendTransaction
  ): Promise<Schema.TxResponse> => {
    return plugin.sendTransaction(
      input
    );
  },

  sendTransactionAndWait: async (
    input: Schema.Input_sendTransactionAndWait
  ): Promise<Schema.TxReceipt> => {
    return plugin.sendTransactionAndWait(
      input
    );
  },

  deployContract: async (
    input: Schema.Input_deployContract
  ): Promise<string> => {
    return plugin.deployContract(
      input
    );
  },

  signMessage: async (
    input: Schema.Input_signMessage
  ): Promise<string> => {
    return plugin.signMessage(
      input
    );
  },

  sendRPC: async (
    input: Schema.Input_sendRPC
  ): Promise<string> => {
    return plugin.sendRPC(
      input
    );
  },
});

export const query = (plugin: Plugin): Schema.Query => ({
  callContractView: async (
    input: Schema.Input_callContractView
  ): Promise<string> => {
    return plugin.callContractView(
      input
    );
  },

  callContractStatic: async (
    input: Schema.Input_callContractStatic
  ): Promise<Schema.StaticTxResult> => {
    return plugin.callContractStatic(
      input
    );
  },

  encodeParams: async (
    input: Schema.Input_encodeParams
  ): Promise<string> => {
    return plugin.encodeParams(
      input
    );
  },

  getSignerAddress: async (
    input: Schema.Input_getSignerAddress
  ): Promise<string> => {
    return plugin.getSignerAddress(
      input
    );
  },

  getSignerBalance: async (
    input: Schema.Input_getSignerBalance
  ): Promise<string> => {
    return plugin.getSignerBalance(
      input
    );
  },

  getSignerTransactionCount: async (
    input: Schema.Input_getSignerTransactionCount
  ): Promise<string> => {
    return plugin.getSignerTransactionCount(
      input
    );
  },

  getGasPrice: async (
    input: Schema.Input_getGasPrice
  ): Promise<string> => {
    return plugin.getGasPrice(
      input
    );
  },

  estimateTransactionGas: async (
    input: Schema.Input_estimateTransactionGas
  ): Promise<string> => {
    return plugin.estimateTransactionGas(
      input
    );
  },

  estimateContractCallGas: async (
    input: Schema.Input_estimateContractCallGas
  ): Promise<string> => {
    return plugin.estimateContractCallGas(
      input
    );
  },

  checkAddress: async (
    input: Schema.Input_checkAddress
  ): Promise<boolean> => {
    return plugin.checkAddress(
      input
    );
  },

  toWei: async (
    input: Schema.Input_toWei
  ): Promise<string> => {
    return plugin.toWei(
      input
    );
  },

  toEth: async (
    input: Schema.Input_toEth
  ): Promise<string> => {
    return plugin.toEth(
      input
    );
  },

  waitForEvent: async (
    input: Schema.Input_waitForEvent
  ): Promise<Schema.EventNotification> => {
    return plugin.waitForEvent(
      input
    );
  },

  awaitTransaction: async (
    input: Schema.Input_awaitTransaction
  ): Promise<Schema.TxReceipt> => {
    return plugin.awaitTransaction(
      input
    );
  },
});
