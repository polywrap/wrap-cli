import { EthereumPlugin as Plugin } from ".";
import { Query, Mutation } from "./w3";
import * as Types from "./w3";

export const mutation = (plugin: Plugin): Mutation.Module => ({
  callContractMethod: async (
    input: Mutation.Input_callContractMethod
  ): Promise<Types.TxResponse> => {
    return plugin.callContractMethod(input);
  },

  callContractMethodAndWait: async (
    input: Mutation.Input_callContractMethodAndWait
  ): Promise<Types.TxReceipt> => {
    return plugin.callContractMethodAndWait(input);
  },

  sendTransaction: async (
    input: Mutation.Input_sendTransaction
  ): Promise<Types.TxResponse> => {
    return plugin.sendTransaction(input);
  },

  sendTransactionAndWait: async (
    input: Mutation.Input_sendTransactionAndWait
  ): Promise<Types.TxReceipt> => {
    return plugin.sendTransactionAndWait(input);
  },

  deployContract: async (
    input: Mutation.Input_deployContract
  ): Promise<string> => {
    return plugin.deployContract(input);
  },

  signMessage: async (input: Mutation.Input_signMessage): Promise<string> => {
    return plugin.signMessage(input);
  },

  sendRPC: async (input: Mutation.Input_sendRPC): Promise<string> => {
    return plugin.sendRPC(input);
  },
});

export const query = (plugin: Plugin): Query.Module => ({
  callContractView: async (
    input: Query.Input_callContractView
  ): Promise<string> => {
    return plugin.callContractView(input);
  },

  callContractStatic: async (
    input: Query.Input_callContractStatic
  ): Promise<Types.StaticTxResult> => {
    return plugin.callContractStatic(input);
  },

  encodeParams: async (input: Query.Input_encodeParams): Promise<string> => {
    return plugin.encodeParams(input);
  },

  encodeFunction: async (
    input: Query.Input_encodeFunction
  ): Promise<string> => {
    return plugin.encodeFunction(input);
  },

  solidityPack: async (input: Query.Input_solidityPack): Promise<string> => {
    return plugin.solidityPack(input);
  },

  solidityKeccak256: async (
    input: Query.Input_solidityKeccak256
  ): Promise<string> => {
    return plugin.solidityKeccak256(input);
  },

  soliditySha256: async (
    input: Query.Input_soliditySha256
  ): Promise<string> => {
    return plugin.soliditySha256(input);
  },

  getSignerAddress: async (
    input: Query.Input_getSignerAddress
  ): Promise<string> => {
    return plugin.getSignerAddress(input);
  },

  getSignerBalance: async (
    input: Query.Input_getSignerBalance
  ): Promise<string> => {
    return plugin.getSignerBalance(input);
  },

  getSignerTransactionCount: async (
    input: Query.Input_getSignerTransactionCount
  ): Promise<string> => {
    return plugin.getSignerTransactionCount(input);
  },

  getGasPrice: async (input: Query.Input_getGasPrice): Promise<string> => {
    return plugin.getGasPrice(input);
  },

  estimateTransactionGas: async (
    input: Query.Input_estimateTransactionGas
  ): Promise<string> => {
    return plugin.estimateTransactionGas(input);
  },

  estimateContractCallGas: async (
    input: Query.Input_estimateContractCallGas
  ): Promise<string> => {
    return plugin.estimateContractCallGas(input);
  },

  checkAddress: async (input: Query.Input_checkAddress): Promise<boolean> => {
    return plugin.checkAddress(input);
  },

  toWei: async (input: Query.Input_toWei): Promise<string> => {
    return plugin.toWei(input);
  },

  toEth: async (input: Query.Input_toEth): Promise<string> => {
    return plugin.toEth(input);
  },

  waitForEvent: async (
    input: Query.Input_waitForEvent
  ): Promise<Types.EventNotification> => {
    return plugin.waitForEvent(input);
  },

  awaitTransaction: async (
    input: Query.Input_awaitTransaction
  ): Promise<Types.TxReceipt> => {
    return plugin.awaitTransaction(input);
  },

  getNetwork: async (input: Query.Input_getNetwork): Promise<Types.Network> => {
    return plugin.getNetwork(input);
  },
});
